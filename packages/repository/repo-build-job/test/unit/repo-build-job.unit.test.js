'use strict'
const {describe, it} = require('mocha')
const {expect} = require('chai')

const repoBuildJobModule = require('../..')

describe('repo-build-job', function() {
  describe('getBuildJob', () => {
    const repoBuildJobRunner = repoBuildJobModule({plugins: []})

    it('should execute a simple job', () => {
      const artifacts = [
        {artifact: 'a', path: 'a'},
        {artifact: 'b', path: 'b'},
        {artifact: 'c', path: 'ccc'},
      ]
      const repoJob = {filesChangedSinceLastBuild: undefined, linkDependencies: false}

      const jobsThatRan = runRepoJob(artifacts, repoJob, repoBuildJobRunner)

      expect(jobsThatRan.map(j => j.artifact)).to.eql(['a', 'b', 'c'])
    })

    it('should execute only builds that have changed files', () => {
      const artifacts = [
        {artifact: 'a', path: 'a'},
        {artifact: 'b', path: 'b'},
        {artifact: 'c', path: 'ccc'},
      ]
      const repoJob = {
        filesChangedSinceLastBuild: ['a/foo.js', 'ccc/x.js', 'ccc/z.z'],
        linkDependencies: false,
      }

      const jobsThatRan = runRepoJob(artifacts, repoJob, repoBuildJobRunner)

      expect(jobsThatRan.map(j => j.artifact)).to.eql(['a', 'c'])
    })
  })
})

function runRepoJob(artifacts, repoJob, repoBuildJobRunner) {
  let jobResult = repoBuildJobRunner.getBuildSteps({
    howToBuild: {initialAllArtifacts: artifacts},
    job: repoJob,
  })
  const jobsList = [...((jobResult.jobs || []).map(j => j.job) || [])]
  const jobsToDo = (jobResult.jobs || []).map(j => j.job) || []

  while (jobResult.jobs && jobResult.jobs.length > 0) {
    expect(jobResult.jobs.every(j => j.awaken))
    const doneJob = jobsToDo.pop()

    jobResult = repoBuildJobRunner.getBuildSteps({
      howToBuild: {
        state: jobResult.state,
        initialAllArtifacts: undefined,
        awakenedFrom: {job: doneJob},
      },
      job: repoJob,
    })
    jobsList.push(...(jobResult.jobs || []).map(j => j.job))
    if (jobResult.jobs)
      expect(jobsToDo.map(j => j.artifact)).to.not.have.members(
        (jobResult.jobs || []).map(j => j.artifact),
      )
    jobsToDo.push(...(jobResult.jobs || []).map(j => j.job))
  }
  expect(jobsToDo).to.have.length(0)

  return jobsList
}