pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Backend Build') {
            steps {
                dir('backend') {
                    sh 'python3 -m pip install -r requirements.txt'
                }
            }
        }

    }

    post {
        success {
            echo 'Phase 1 Completed Successfully'
        }

        failure {
            echo 'Phase 1 Failed'
        }
    }
}
