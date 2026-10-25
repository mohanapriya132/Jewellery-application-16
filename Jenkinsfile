
pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/mohanapriya132/Jewellery-application-16.git'
            }
        }

        stage('Check Environment') {
            steps {
                bat 'node --version'
                bat 'npm --version'
            }
        }

        stage('Verify Project') {
            steps {
                bat 'dir Frontend'
                bat 'dir Backend'
                echo 'Jewellery project verification completed!'
            }
        }

        stage('Frontend Build') {
            steps {
                dir('Frontend') {
                    bat 'npm ci'
                    bat 'npm run build'
                }
            }
        }

        stage('Backend Verification') {
            steps {
                dir('Backend') {
                    bat 'npm ci'
                    bat 'node --check server.js'
                }
            }
        }
        
stage('Frontend Lint') {
    steps {
        dir('Frontend') {
            bat 'npm run lint'
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
    }
}
