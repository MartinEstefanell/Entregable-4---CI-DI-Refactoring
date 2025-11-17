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
                    // Ruta completa a mvn (según tu instalación con Scoop)
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
                    // Por ahora dejamos npm "normal".
                    // Si después falla con 'npm is not recognized',
                    // hacemos lo mismo que con mvn usando la ruta completa de npm.
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
