pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        // ====================================================================
        // GCP & Registry Configuration (Override via Jenkins environment if needed)
        // ====================================================================
        GCP_PROJECT_ID           = "${env.GCP_PROJECT_ID ?: 'cova-taskflow-project'}"
        GCP_REGION               = "${env.GCP_REGION ?: 'europe-west1'}"
        GCP_SA_KEY_CREDENTIAL_ID = 'gcp-sa-key' // Jenkins Secret File credential ID
        ARTIFACT_REPO            = 'taskflow'
        SERVICE_NAME             = 'task-manager-frontend'

        // Registry Host & Image Name
        REGISTRY_HOST            = "${GCP_REGION}-docker.pkg.dev"
        IMAGE_NAME               = "${REGISTRY_HOST}/${GCP_PROJECT_ID}/${ARTIFACT_REPO}/${SERVICE_NAME}"
        IMAGE_TAG                = "${env.BUILD_NUMBER ?: 'latest'}"

        // Backend service name (to discover its Cloud Run URL dynamically)
        BACKEND_SERVICE_NAME     = 'task-manager-api'
    }

    stages {
        // ====================================================================
        // 1. Checkout Repository
        // ====================================================================
        stage('Checkout') {
            steps {
                checkout scm
                echo "Triggered frontend build #${env.BUILD_NUMBER} on branch ${env.BRANCH_NAME ?: 'main'}"
            }
        }

        // ====================================================================
        // 2. Install Dependencies & Validate Build
        // ====================================================================
        stage('Install & Build Validation') {
            steps {
                echo "Installing dependencies and running TypeScript + Vite production build..."
                sh '''
                    npm ci
                    npm run build
                '''
            }
        }

        // ====================================================================
        // 3. Build Multi-Stage Production Docker Image
        // ====================================================================
        stage('Build Docker Image') {
            steps {
                echo "Building frontend production Docker image with Nginx..."
                sh """
                    docker build --build-arg VITE_API_BASE_URL=/api \
                                 -t ${IMAGE_NAME}:${IMAGE_TAG} \
                                 -t ${IMAGE_NAME}:latest \
                                 .
                """
            }
        }

        // ====================================================================
        // 4. Authenticate & Push Image to GCP Artifact Registry
        // ====================================================================
        stage('Push to GCP Artifact Registry') {
            steps {
                withCredentials([file(credentialsId: "${GCP_SA_KEY_CREDENTIAL_ID}", variable: 'GCP_KEY_FILE')]) {
                    sh """
                        # Authenticate gcloud with Service Account
                        gcloud auth activate-service-account --key-file=\${GCP_KEY_FILE}
                        gcloud config set project ${GCP_PROJECT_ID}

                        # Configure Docker helper for GCP Artifact Registry
                        gcloud auth configure-docker ${REGISTRY_HOST} --quiet

                        # Ensure artifact repository exists (idempotent)
                        gcloud artifacts repositories describe ${ARTIFACT_REPO} \
                            --location=${GCP_REGION} >/dev/null 2>&1 || \
                        gcloud artifacts repositories create ${ARTIFACT_REPO} \
                            --repository-format=docker \
                            --location=${GCP_REGION} \
                            --description="TaskFlow Docker Images"

                        echo "Pushing frontend image..."
                        docker push ${IMAGE_NAME}:${IMAGE_TAG}
                        docker push ${IMAGE_NAME}:latest
                    """
                }
            }
        }

        // ====================================================================
        // 5. Deploy Frontend Service to GCP Cloud Run
        // ====================================================================
        stage('Deploy to Cloud Run') {
            steps {
                withCredentials([file(credentialsId: "${GCP_SA_KEY_CREDENTIAL_ID}", variable: 'GCP_KEY_FILE')]) {
                    sh """
                        gcloud auth activate-service-account --key-file=\${GCP_KEY_FILE}
                        gcloud config set project ${GCP_PROJECT_ID}

                        # Dynamically discover deployed Backend URL from its Cloud Run service
                        BACKEND_URL=\$(gcloud run services describe ${BACKEND_SERVICE_NAME} \
                            --platform=managed \
                            --region=${GCP_REGION} \
                            --format='value(status.url)')

                        echo "Discovered Backend Cloud Run URL: \${BACKEND_URL}"

                        echo "Deploying ${SERVICE_NAME} with Nginx dynamic proxy to \${BACKEND_URL}..."
                        gcloud run deploy ${SERVICE_NAME} \
                            --image=${IMAGE_NAME}:${IMAGE_TAG} \
                            --platform=managed \
                            --region=${GCP_REGION} \
                            --allow-unauthenticated \
                            --port=80 \
                            --cpu=1 \
                            --memory=256Mi \
                            --min-instances=0 \
                            --max-instances=3 \
                            --set-env-vars="BACKEND_URL=\${BACKEND_URL}"

                        FRONTEND_URL=\$(gcloud run services describe ${SERVICE_NAME} \
                            --platform=managed \
                            --region=${GCP_REGION} \
                            --format='value(status.url)')

                        echo "==============================================================="
                        echo "🚀 FRONTEND DEPLOYED SUCCESSFULLY!"
                        echo "Frontend UI  : \${FRONTEND_URL}"
                        echo "Backend API  : \${BACKEND_URL}/api"
                        echo "==============================================================="
                    """
                }
            }
        }
    }

    // ====================================================================
    // Post-Build Notifications & Cleanup
    // ====================================================================
    post {
        success {
            echo "Frontend pipeline succeeded! UI is live on GCP Cloud Run."
        }
        failure {
            echo "Frontend pipeline failed! Please inspect logs."
        }
        cleanup {
            sh 'docker image prune -f || true'
        }
    }
}
