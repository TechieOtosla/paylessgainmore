
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

                jf 'rt build-publish'
            }
        }

        stage('Archive') {
            steps {
                archiveArtifacts artifacts: 'target/*.war'
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh 'cp target/paylessgainmore-1.0.1.war /var/lib/tomcat10/webapps/paylessgainmore.war'
            }
        }
    }
}

