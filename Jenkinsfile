
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
                script {
                    echo "Branch: ${env.BRANCH_NAME}"
                    echo "PR Number: ${env.CHANGE_ID}"
                    echo "PR Target: ${env.CHANGE_TARGET}"
                }
            }
        }

        stage('PR - Validation') {
            when {
                allOf {
                    changeRequest()
                    expression {
                        return env.CHANGE_TARGET == 'release/v1.0'
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
                            node --version
                            npm --version
                            npm ci
                            npm test -- --watch=false
                        '''
                    }
                }

                stage('Angular Build Validation') {
                    steps {
                        sh '''
                            set -eu
                            npm ci
                            npx ng build --configuration production
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
