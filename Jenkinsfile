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
                    // Compila el backend (Spring Boot) sin correr tests todavía
                    bat 'mvn -B clean package -DskipTests'
                }
            }
        }

        stage('Run backend tests') {
            steps {
                dir('backend') {
                    // Ejecuta los tests automáticos (JUnit)
                    bat 'mvn test'
                }
            }
        }

        stage('Build frontend') {
            steps {
                dir('Frontend') {
                    // Instala dependencias y construye el build de producción
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
