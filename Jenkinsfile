
pipeline {
    agent any

    tools {
        nodejs 'node22'
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

        stage('PR - Install Dependencies') {
            when {
                allOf {
                    changeRequest()
                    expression {
                        return env.CHANGE_TARGET?.startsWith('release/')
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
                        return env.CHANGE_TARGET?.startsWith('release/')
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
                            npx ng build --configuration production
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
                                --exit-code 0 \
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
    }

    post {
        success {
            echo 'Angular Frontend PR Validation PASSED.'
        }

        failure {
            echo 'Angular Frontend PR Validation FAILED.'
        }
    }
}
