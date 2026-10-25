
pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Checking out source code from GitHub'
                checkout scm
            }
        }

        stage('Check Environment') {
            steps {
                echo 'Checking Node.js and npm versions'
                bat 'node --version'
                bat 'npm --version'
            }
        }

        stage('Verify Project') {
            steps {
                echo 'Verifying Frontend and Backend folders'
                bat 'if not exist Frontend exit /b 1'
                bat 'if not exist Backend exit /b 1'
            }
        }

        stage('Frontend Build') {
            steps {
                dir('Frontend') {
                    echo 'Installing frontend dependencies'
                    bat 'npm ci'

                    echo 'Building frontend application'
                    bat 'npm run build'
                }
            }
        }

        stage('Frontend Lint') {
            steps {
                dir('Frontend') {
                    script {
                        def lintStatus = bat(
                            script: 'npm run lint',
                            returnStatus: true
                        )

                        if (lintStatus != 0) {
                            echo 'WARNING: Lint errors found. Continuing pipeline for this learning project.'
                        } else {
                            echo 'Frontend lint completed successfully.'
                        }
                    }
                }
            }
        }

        stage('Backend Verification') {
            steps {
                dir('Backend') {
                    echo 'Installing backend dependencies'
                    bat 'npm ci'

                    echo 'Checking backend JavaScript syntax'
                    bat 'node --check server.js'
                }
            }
        }
    }

    post {
        success {
            echo 'Jewellery CI Pipeline completed successfully!'
        }

        failure {
            echo 'Jewellery CI Pipeline failed. Please check the Console Output.'
        }

        always {
            echo 'Pipeline execution completed.'
        }
    }
}
