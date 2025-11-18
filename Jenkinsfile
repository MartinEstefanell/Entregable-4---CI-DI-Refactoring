pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Toma el código del repositorio Git (usa la config del job)
                checkout scm
            }
        }

        stage('Build backend') {
            steps {
                dir('backend') {
                    // Ruta completa a mvn 
                    bat '"C:\\Users\\agust\\scoop\\apps\\maven\\current\\bin\\mvn" -B clean package -DskipTests'
                }
            }
        }

        stage('Run backend tests') {
            steps {
                dir('backend') {
                    bat '"C:\\Users\\agust\\scoop\\apps\\maven\\current\\bin\\mvn" test'
                }
            }
        }

        stage('Build frontend') {
            steps {
                dir('Frontend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }

        stage('Deploy') {
            steps {
                // Ejecuta el script de deploy para Windows
                bat 'deploy-windows.bat'
            }
        }
    }
}
