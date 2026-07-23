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
        sh '''
        echo "Deploying Application..."

        # Stop old containers
        docker stop office-frontend || true
        docker rm office-frontend || true

        docker stop office-backend || true
        docker rm office-backend || true

        # Pull latest images
        docker pull ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/office-frontend:latest
        docker pull ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/office-backend:latest

        # Run Backend
        docker run -d \
        --name office-backend \
        -p 5000:5000 \
        ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/office-backend:latest

        # Run Frontend
        docker run -d \
        --name office-frontend \
        -p 3000:3000 \
        ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/office-frontend:latest
        '''
    }
}

stage('Health Check') {
    steps {
        sh '''
        echo "Waiting for application..."
        sleep 20

        curl http://localhost:3000
        curl http://localhost:5000
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
}stage('Backup Current Production') {
    steps {
        sh '''
        docker tag ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/office-frontend:latest \
        office-frontend:backup || true

        docker tag ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/office-backend:latest \
        office-backend:backup || true
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
