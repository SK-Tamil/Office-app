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
            sh '''
            python3 -m venv venv
            . venv/bin/activate
            pip install --upgrade pip
            pip install -r requirements.txt
            '''
        }
    }
}
    stage('SonarQube Analysis') {
    steps {
        script {
            def scannerHome = tool 'SonarScanner'

            withSonarQubeEnv('SonarQube') {
                sh "${scannerHome}/bin/sonar-scanner"
            }
        }
    }
}

stage('Quality Gate') {
    steps {
        timeout(time: 5, unit: 'MINUTES') {
            waitForQualityGate abortPipeline: true
        }
    }
}

stage('Docker Build - Frontend') {
    steps {
        dir('frontend') {
            sh '''
            docker build -t office-frontend:latest .
            '''
        }
    }
}

stage('Docker Build - Backend') {
    steps {
        dir('backend') {
            sh '''
            docker build -t office-backend:latest .
            '''
        }
    }
}

stage('Verify Docker Images') {
    steps {
        sh 'docker images'
    }
}
stage('Trivy Scan - Frontend') {
    steps {
        sh '''
        mkdir -p reports
        trivy image office-frontend:latest > reports/frontend-trivy-report.txt
        '''
    }
}

stage('Trivy Scan - Backend') {
    steps {
        sh '''
        trivy image office-backend:latest > reports/backend-trivy-report.txt
        '''
    }
}





    }

    post {

always {
        archiveArtifacts artifacts: 'reports/*', fingerprint: true
    }
        success {
            echo 'Phase 1 Completed Successfully'
        }

        failure {
            echo 'Phase 1 Failed'
        }
    }
}
