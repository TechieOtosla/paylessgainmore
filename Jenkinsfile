pipeline {
  agent { label 'maven' }
  stages {
    stage('Build') {
      steps { sh 'mvn -B clean package' }
    }
    stage('Archive') {
      steps { archiveArtifacts artifacts: 'target/*.war' }
    }
  }
}
