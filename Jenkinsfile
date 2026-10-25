
pipeline {
    agent any

    tools {
        nodejs 'node24'
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
                            npm run build
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

        stage('Release - Code Quality Validation') {

            when {
                allOf {
                    not {
                        changeRequest()
                    }
                    expression {
                        return env.BRANCH_NAME?.startsWith('release/')
                    }
                }  
            }

            stages {

                stage('SonarQube Analysis') {
                    steps {
                        script {
                            def scannerHome = tool 'SonarScanner'

                            withSonarQubeEnv('SonarQube-Server') {
                                sh """
                                    ${scannerHome}/bin/sonar-scanner \
                                    -Dsonar.projectKey=ecommerce-frontend \
                                    -Dsonar.sources=src \
                                    -Dsonar.tests=src \
                                    '-Dsonar.test.inclusions=**/*.spec.ts' \
                                    '-Dsonar.exclusions=**/*.spec.ts' \
                                    '-Dsonar.javascript.lcov.reportPaths=coverage/lcov.info'
                                """
                            }
                        }
                    }
                }
                       
                stage('SonarQube Quality Gate') {
                    steps {
                        timeout(time: 10, unit: 'MINUTES') {
                            waitForQualityGate abortPipeline: true
                        }
                    }
                }

            }
        }

    }
}

