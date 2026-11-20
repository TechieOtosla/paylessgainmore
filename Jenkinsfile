
pipeline {
    agent { label 'maven' }

    tools {
        jfrog 'jfrog-cli'
    }

    stages {
        stage('Check pages') {
            steps {
                sh 'bash scripts/check-meta.sh'
            }
        }

        stage('Build') {
            steps {
                sh 'mvn -B clean package'
            }
        }

        stage('Verify JFrog CLI') {
            steps {
                jf '-v'
                jf 'rt ping'
            }
        }

        stage('Publish to JFrog') {
            steps {
                jf 'rt upload target/paylessgainmore-1.0.1.war maven-local/com/paylessgainmore/paylessgainmore/1.0.1/paylessgainmore-1.0.1.war --flat=true'

                jf 'rt upload pom.xml maven-local/com/paylessgainmore/paylessgainmore/1.0.1/paylessgainmore-1.0.1.pom --flat=true'
            }
        }

        stage('Archive') {
            steps {
                archiveArtifacts artifacts: 'target/*.war'
            }
        }

        stage('Download from JFrog') {
            steps {
                sh 'mkdir -p deploy'

                jf 'rt download maven-local/com/paylessgainmore/paylessgainmore/1.0.1/paylessgainmore-1.0.1.war deploy/paylessgainmore-1.0.1.war --flat=true'
            }
        }

        stage('Deploy to Tomcat') {
            steps {
                sh '''
                    scp -i ~/.ssh/id_ed25519 \
                    -o BatchMode=yes \
                    -o StrictHostKeyChecking=yes \
                    deploy/paylessgainmore-1.0.1.war \
                    root@172.31.43.8:/opt/tomcat/webapps/paylessgainmore.war

                    ssh -i ~/.ssh/id_ed25519 \
                    -o BatchMode=yes \
                    -o StrictHostKeyChecking=yes \
                    root@172.31.43.8 \
                    "chown tomcat:tomcat /opt/tomcat/webapps/paylessgainmore.war && chmod 644 /opt/tomcat/webapps/paylessgainmore.war"
                '''
            }
        }
    }
}
