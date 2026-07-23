pipeline {
    agent any

environment {
    AWS_REGION = 'ap-southeast-1'
    AWS_ACCOUNT_ID = '808872801655'
}

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
stage('Login to Amazon ECR') {
    steps {
        withCredentials([[
            $class: 'AmazonWebServicesCredentialsBinding',
            credentialsId: 'aws-ecr'
        ]]) {
            sh '''
            aws ecr get-login-password --region $AWS_REGION | \
            docker login --username AWS --password-stdin \
            $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
            '''
        }
    }
}
stage('Tag Docker Images') {
    steps {
        sh '''
        docker tag office-frontend:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/office-frontend:latest

        docker tag office-backend:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/office-backend:latest
        '''
    }
}
stage('Push Images to ECR') {
    steps {
        sh '''
        docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/office-frontend:latest

        docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/office-backend:latest
        '''
    }
}

stage('Deploy to Development') {
    steps {
        withCredentials([[
            $class: 'AmazonWebServicesCredentialsBinding',
            credentialsId: 'aws-ecr'
        ]]) {
            sh '''
            aws ecr get-login-password --region $AWS_REGION | \
            docker login --username AWS --password-stdin \
            $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

            docker compose down || true

            docker compose pull

            docker compose up -d
            '''
        }
    }
}


 stage('Health Check') {
    steps {
        sh '''
        echo "Waiting for containers to start..."
        sleep 20

        echo "Checking Nginx..."
        curl -f http://localhost

        echo "Checking Backend API..."
        curl -f http://localhost/api/employees

        echo "Health Check Passed!"
        '''
    }
}

  stage('Manual Approval') {
    steps {
        input(
            message: 'Deploy to Production?',
            ok: 'Deploy'
        )
    }
}

    stage('Backup Current Production') {
    steps {
        sh '''
        docker tag ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/office-frontend:latest \
        office-frontend:backup || true

        docker tag ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/office-backend:latest \
        office-backend:backup || true
        '''
    }
}

 stage('Deploy to Production') {
    steps {
        withCredentials([[
            $class: 'AmazonWebServicesCredentialsBinding',
            credentialsId: 'aws-ecr'
        ]]) {
            sh '''
            echo "Deploying to Production..."

            aws ecr get-login-password --region $AWS_REGION | \
            docker login --username AWS --password-stdin \
            $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

            docker compose down || true

            docker rm -f office-frontend office-backend office-nginx || true

            docker compose pull

            docker compose up -d

            echo "Production Deployment Successful"
            '''
        }
    }
}

stage('Production Health Check') {
    steps {
        sh '''
        echo "Waiting for application..."
        sleep 20

        curl -f http://localhost

        curl -f http://localhost/api/employees

        echo "Production Health Check Passed"
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
             sh '''
        echo "Deployment failed. Rolling back..."

        docker compose down || true

        docker tag office-frontend:backup office-frontend:latest || true
        docker tag office-backend:backup office-backend:latest || true

        docker compose up -d
        '''
        }
    }
}
