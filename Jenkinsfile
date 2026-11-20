
pipeline {
    agent any

    tools {
        nodejs 'node24'
    }

    environment {
        AWS_DEFAULT_REGION = 'us-east-1'
        S3_BUCKET = 'ecommerce-prod-frontend-spontansolutions'
        CLOUDFRONT_DISTRIBUTION_ID = 'E1NYHEW0GZ9TCF'
        BUILD_DIR = 'dist/ecommerce-frontend/browser'
        PROD_URL = 'https://shop.spontansolutions.com'
    }

    options {
        timestamps()
        disableConcurrentBuilds()
        skipDefaultCheckout(true)
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Identify Build') {
            steps {
                echo "Branch: ${env.BRANCH_NAME}"
                echo "PR Number: ${env.CHANGE_ID}"
                echo "PR Target: ${env.CHANGE_TARGET}"
            }
        }

        stage('Install Dependencies') {
            when {
                anyOf {
                    allOf {
                        changeRequest()
                        expression {
                            return env.CHANGE_TARGET == 'master'
                        }
                    }
                    allOf {
                        not { changeRequest() }
                        branch 'master'
                    }
                }
            }

            steps {
                sh '''
                    set -eu

                    node --version
                    npm --version
                    npm ci
                '''
            }
        }

        stage('PR - Validation') {
            when {
                allOf {
                    changeRequest()
                    expression {
                        return env.CHANGE_TARGET == 'master'
                    }
                }
            }

            parallel {

                stage('Gitleaks Secret Scan') {
                    steps {
                        sh '''
                            set -eu
                            gitleaks git . --redact --exit-code 1
                        '''
                    }
                }

                stage('Angular Unit Tests') {
                    steps {
                        sh '''
                            set -eu
                            npm test -- --watch=false
                        '''
                    }
                }

                stage('Angular Build Validation') {
                    steps {
                        sh '''
                            set -eu
                            npm run build -- --configuration production
                            test -f "$BUILD_DIR/index.html"
                        '''
                    }
                }

                stage('Trivy FS Scan') {
                    steps {
                        sh '''
                            set -eu

                            trivy fs \
                                --scanners vuln,secret,misconfig \
                                --severity HIGH,CRITICAL \
                                --exit-code 1 \
                                --skip-dirs node_modules \
                                --skip-dirs .git \
                                --skip-dirs dist \
                                --format table \
                                .
                        '''
                    }
                }
            }
        }

        stage('PR - SonarQube Analysis') {
            when {
                allOf {
                    changeRequest()
                    expression {
                        return env.CHANGE_TARGET == 'master'
                    }
                }
            }

            steps {
                script {
                    def scannerHome = tool 'SonarScanner'

                    withSonarQubeEnv('SonarQube-Server') {
                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                                -Dsonar.projectKey=ecommerce-frontend-prod \
                                -Dsonar.sources=src \
                                -Dsonar.tests=src \
                                '-Dsonar.test.inclusions=**/*.spec.ts' \
                                '-Dsonar.exclusions=**/*.spec.ts' \
                                -Dsonar.nodejs.executable=\$(command -v node)
                        """
                    }
                }
            }
        }

        stage('PR - SonarQube Quality Gate') {
            when {
                allOf {
                    changeRequest()
                    expression {
                        return env.CHANGE_TARGET == 'master'
                    }
                }
            }

            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Master - Security Scan') {
            when {
                allOf {
                    not { changeRequest() }
                    branch 'master'
                }
            }

            parallel {

                stage('Gitleaks Secret Scan') {
                    steps {
                        sh '''
                            set -eu
                            gitleaks git . --redact --exit-code 1
                        '''
                    }
                }

                stage('Trivy FS Scan') {
                    steps {
                        sh '''
                            set -eu

                            trivy fs \
                                --scanners vuln,secret,misconfig \
                                --severity HIGH,CRITICAL \
                                --exit-code 1 \
                                --skip-dirs node_modules \
                                --skip-dirs .git \
                                --skip-dirs dist \
                                --format table \
                                .
                        '''
                    }
                }
            }
        }

        stage('Master - Unit Tests') {
            when {
                allOf {
                    not { changeRequest() }
                    branch 'master'
                }
            }

            steps {
                sh '''
                    set -eu
                    npm test -- --watch=false
                '''
            }
        }

        stage('Master - Angular Build') {
            when {
                allOf {
                    not { changeRequest() }
                    branch 'master'
                }
            }

            steps {
                sh '''
                    set -eu

                    echo "Building production Angular application..."

                    npm run build -- --configuration production

                    test -f "$BUILD_DIR/index.html"

                    echo "Production Angular build successful."
                '''
            }
        }

        stage('Master - SonarQube Analysis') {
            when {
                allOf {
                    not { changeRequest() }
                    branch 'master'
                }
            }

            steps {
                script {
                    def scannerHome = tool 'SonarScanner'

                    withSonarQubeEnv('SonarQube-Server') {
                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                                -Dsonar.projectKey=ecommerce-frontend-prod \
                                -Dsonar.sources=src \
                                -Dsonar.tests=src \
                                '-Dsonar.test.inclusions=**/*.spec.ts' \
                                '-Dsonar.exclusions=**/*.spec.ts' \
                                -Dsonar.nodejs.executable=\$(command -v node)
                        """
                    }
                }
            }
        }

        stage('Master - SonarQube Quality Gate') {
            when {
                allOf {
                    not { changeRequest() }
                    branch 'master'
                }
            }

            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Production Approval') {
            when {
                allOf {
                    not { changeRequest() }
                    branch 'master'
                }
            }

            steps {
                timeout(time: 30, unit: 'MINUTES') {
                    input message: 'Approve frontend deployment to PRODUCTION?',
                          ok: 'Deploy to Production',
                          submitter: 'REPLACE_WITH_APPROVED_JENKINS_USER'
                }
            }
        }

        stage('Master - Deploy to S3') {
            when {
                allOf {
                    not { changeRequest() }
                    branch 'master'
                }
            }

            steps {
                sh '''
                    set -eu

                    echo "Verifying production build output..."

                    test -f "$BUILD_DIR/index.html"

                    echo "Deploying Angular frontend to production S3..."

                    aws s3 sync \
                        "$BUILD_DIR/" \
                        "s3://$S3_BUCKET/" \
                        --region "$AWS_DEFAULT_REGION" \
                        --delete

                    echo "Production S3 deployment completed."
                '''
            }
        }

        stage('Master - CloudFront Invalidation') {
            when {
                allOf {
                    not { changeRequest() }
                    branch 'master'
                }
            }

            steps {
                sh '''
                    set -eu

                    INVALIDATION_ID=$(aws cloudfront create-invalidation \
                        --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
                        --paths "/*" \
                        --query 'Invalidation.Id' \
                        --output text)

                    echo "Invalidation created: $INVALIDATION_ID"

                    aws cloudfront wait invalidation-completed \
                        --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
                        --id "$INVALIDATION_ID"

                    echo "CloudFront invalidation completed."
                '''
            }
        }

        stage('Production Smoke Test') {
            when {
                allOf {
                    not { changeRequest() }
                    branch 'master'
                }
            }

            steps {
                sh '''
                    set -eu

                    curl --fail --silent --show-error \
                        "$PROD_URL" > /dev/null

                    echo "Production frontend smoke test passed."
                '''
            }
        }
    }

    post {
        success {
            echo 'Angular production pipeline completed successfully.'
        }

        failure {
            echo 'Angular production pipeline failed.'
        }

        always {
            echo "Build branch: ${env.BRANCH_NAME}"
            echo "Build result: ${currentBuild.currentResult}"
        }
    }
}
