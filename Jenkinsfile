pipeline {
  agent { label 'maven' }
  stages {
    stage('Check pages') {
      steps { sh 'bash scripts/check-meta.sh' }
    }
    stage('Build') {
      steps { sh 'mvn -B clean package' }
    }
    stage('Archive') {
      steps { archiveArtifacts artifacts: 'target/*.war' }
    }
    stage('Deploy') {
      when { branch 'main' }
      steps { sh 'cp target/paylessgainmore-1.0.0.war /var/lib/tomcat10/webapps/paylessgainmore.war' }
    }
  }
}
