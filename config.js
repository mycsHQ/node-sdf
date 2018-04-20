module.exports = {
  netsuite: {
    account: '',
    email: '',
    url: '',
    role: 3
  },
  dependencies: {
    javaClass: 'https://system.netsuite.com/download/ide/update_17_2/plugins/com.netsuite.ide.core_2017.2.1.jar ',
    supplemental: 'https://system.netsuite.com/core/media/media.nl?id=87134768&c=NLCORP&h=8e8f2820ee2d719ac411&id=87134768&_xt=.gz&_xd=T&e=T.bin',
    maven: 'http://artfiles.org/apache.org/maven/maven-3/3.5.2/binaries/apache-maven-3.5.2-bin.tar.gz'
  },
  cliCommands: {
    adddependencies: 'adddependencies',
    deploy: 'deploy',
    importbundle: 'importbundle',
    importconfiguration: 'importconfiguration',
    importfiles: 'importfiles',
    importobjects: 'importobjects',
    listbundles: 'listbundles',
    listconfiguration: 'listconfiguration',
    listfiles: 'listfiles',
    listmissingdependencies: 'listmissingdependencies',
    listobjects: 'listobjects',
    preview: 'preview',
    project: 'project',
    update: 'update',
    updatecustomrecordwithinstances: 'updatecustomrecordwithinstances',
    validate: 'validate'
  },
  templates: {
    deploy: {
      deploy: {
        files: {},
        objects: { path: '~/Objects/*' }
      }
    },
    manifest: {
      manifest: {
        $: {},
        frameworkversion: '1.0',
        dependencies: {
          features: {
            feature: [
              {
                $: { required: 'true' },
                _: 'CUSTOMRECORDS'
              },
              {
                $: { required: 'true' },
                _: 'SERVERSIDESCRIPTING'
              },
              {
                $: { required: 'false' },
                _: 'CREATESUITEBUNDLES'
              }
            ]
          }
        }
      }
    }
  }
};
