
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
