export class JobGraph {
   /**
    * 
    * @param {Array} nodes 
    * @param {Array} links 
    * @param {Object} meta 
    */
   constructor(nodes=[], links=[], meta=null) {
      this.nodes = nodes;
      this.links = links;
      this.meta  = meta
   }

   static fromRawData(rawData, linkMode) {
        // console.log('rawData', rawData)

        // metadata
        const meta = {
            playerSummary: JSON.parse(rawData.PlayerSummary.replaceAll('\\', '')),
            populationSummary: JSON.parse(rawData.PopulationSummary.replaceAll('\\', '').replaceAll('_', ' ')),
            maxAvgTime: 0,
            minAvgTime: Infinity
        }

        // nodes
        let nodeBuckets = {}
        for (const [key, value] of Object.entries(rawData)) {
            if (key.substring(0, 3) !== 'job' && key.substring(0, 7) !== 'mission') continue

            const [k, metric] = key.split('_')
            // console.log(`${k}'s ${metric}: ${value}`);
            if (metric === 'JobsAttempted-avg-time-per-attempt') {
                if (parseFloat(value) > meta.maxAvgTime) meta.maxAvgTime = parseFloat(value)
                if (parseFloat(value) < meta.minAvgTime) meta.minAvgTime = parseFloat(value)
            }

            if (!nodeBuckets.hasOwnProperty(k)) nodeBuckets[k] = {} // create node pbject
            if (metric === 'JobsAttempted-job-name') nodeBuckets[k].id = value // store job name as node id
            else if (metric === 'JobsAttempted') continue
            else nodeBuckets[k][metric] = value

            // parse job difficulty json
            if (metric === 'JobsAttempted-job-difficulties') {
                nodeBuckets[k][metric] = JSON.parse(nodeBuckets[k][metric])
            }
        }
        // console.log(nodeBuckets)

        // links
        let l = []
        const rawLinks = JSON.parse(rawData[linkMode].replaceAll('\\', ''))

        switch (linkMode) {
            case 'TopJobCompletionDestinations':
                for (const [sourceKey, targets] of Object.entries(rawLinks)) {
                    for (const [targetKey, players] of Object.entries(targets)) {
                        if (sourceKey === targetKey) continue // omit self-pointing jobs
                        l.push({
                            source: sourceKey,
                            sourceName: sourceKey,
                            target: targetKey,
                            targetName: targetKey,
                            value: players.length,
                            players: players
                        })
                    }
                }
                break;
            case 'TopJobSwitchDestinations':
                for (const [sourceKey, targets] of Object.entries(rawLinks)) {
                    for (const [targetKey, players] of Object.entries(targets)) {
                        if (sourceKey === targetKey) continue // omit self-pointing jobs
                        l.push({
                            source: sourceKey,
                            sourceName: sourceKey,
                            target: targetKey,
                            targetName: targetKey,
                            value: players.length,
                            players: players
                        })
                    }
                }
                break;
            case 'ActiveJobs':
                const activeJobs = Object.keys(rawLinks)
                for (let i = 1; i < activeJobs.length; i++) {
                    const target = activeJobs[i];
                    l.push({
                        source: activeJobs[0],
                        sourceName: activeJobs[0],
                        target: target,
                        targetName: target
                    })
                }
                break;
            default:
                alert('Something went wrong. Plase refresh the page and try again')
                break;
        }

        // filter out nodes w/ no edges
        const relevantNodes = Object.values(nodeBuckets).filter(({ id }) => l.map(link => link.source).includes(id) || l.map(link => link.target).includes(id))
        if (linkMode === 'ActiveJobs')
            relevantNodes.forEach(n => {
                // console.log(rawLinks)
                n.players = rawLinks[n.id]
            });

        // console.log('relevantNodes', relevantNodes)
        // console.log('links', l)
        return new JobGraph(relevantNodes, l, meta);
   }
}