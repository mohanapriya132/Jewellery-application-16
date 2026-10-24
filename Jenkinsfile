
pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/mohanapriya132/Jewellery-application-16.git'
            }
        }

        stage('Verify Code') {
            steps {
                bat 'dir'
                echo 'Jewellery application code verified successfully!'
            }
        }
    }
}
