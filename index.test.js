const fs = require('fs');
const { execSync } = require('child_process');

const index = require('./index');

let testDir = '';
afterEach(() => {
  execSync(`rm -rf ${ testDir }`);
});

describe('index.js', () => {
  describe('sdfCreateProject', () => {
    it('should throw an error if wrong project type', () => {
      expect(() => index.sdfCreateProject('3', {})).toThrowError('Project type has to be either "1" or "2"!');
    });
    it('should throw an error if projectOptions is missing', () => {
      expect(() => index.sdfCreateProject()).toThrowError('Parameter "projectOptions" is required!');
    });
  });

  describe('sdfCreateAccountCustomizationProject', () => {
    const accountCustomizationProject = 'AccountCustomizationProject';

    it('should throw an error if name is missing', () => {
      expect(() => index.sdfCreateAccountCustomizationProject()).toThrowError('Parameter "name" is required!');
    });

    it('should create an account customization project', () => {
      const res = index.sdfCreateAccountCustomizationProject(accountCustomizationProject);
      expect(res.type).toBe('ACCOUNTCUSTOMIZATION');
      expect(res.dir).toContain(`/${ accountCustomizationProject }`);
      expect(res.filebase).toContain(`/${ accountCustomizationProject }/FileCabinet/SuiteScripts`);
      expect(res.name).toBe(accountCustomizationProject);
      expect(res.values).toEqual({ name: accountCustomizationProject });
      expect(fs.existsSync(res.dir)).toBe(true);
      testDir = res.dir;
    });

    it('should create an account customization project in dir', () => {
      const dir = '.dependencies';
      const res = index.sdfCreateAccountCustomizationProject(accountCustomizationProject, dir);
      expect(res.type).toBe('ACCOUNTCUSTOMIZATION');
      expect(res.dir).toContain(`/${ dir }/${ accountCustomizationProject }`);
      expect(res.filebase).toContain(`/${ dir }/${ accountCustomizationProject }/FileCabinet/SuiteScripts`);
      expect(res.name).toBe(accountCustomizationProject);
      expect(res.values).toEqual({ name: accountCustomizationProject });
      expect(fs.existsSync(res.dir)).toBe(true);
      testDir = res.dir;
    });
  });

  describe('sdfCreateSuiteAppProject', () => {
    const suiteAppProject = 'SuiteAppProject';

    it('should throw an error if name is missing', () => {
      expect(() => index.sdfCreateSuiteAppProject()).toThrowError('Parameter "name" is required!');
    });

    it('should throw an error if id is missing', () => {
      expect(() => index.sdfCreateSuiteAppProject('name')).toThrowError('Parameter "id" is required!');
    });

    it('should throw an error if version is missing', () => {
      expect(() => index.sdfCreateSuiteAppProject('name', 'id')).toThrowError('Parameter "version" is required!');
    });

    it('should throw an error if publisherId is missing', () => {
      expect(() => index.sdfCreateSuiteAppProject('name', 'id', 'version')).toThrowError('Parameter "publisherId" is required!');
    });

    it('should create a suite app project', () => {
      const res = index.sdfCreateSuiteAppProject(suiteAppProject, '666', '0.0.1', '123456');
      expect(res.type).toBe('SUITEAPP');
      expect(res.dir).toContain('/123456.666');
      expect(res.filebase).toContain('/123456.666/FileCabinet/SuiteApps');
      expect(res.name).toBe('123456.666');
      expect(res.values).toEqual({
        publisherId: '123456',
        id: '666',
        name: 'SuiteAppProject',
        version: '0.0.1'
      });
      expect(fs.existsSync(res.dir)).toBe(true);
      testDir = res.dir;
    });

    it('should create a suite app project in dir', () => {
      const dir = '.dependencies';
      const res = index.sdfCreateSuiteAppProject(suiteAppProject, '666', '0.0.1', '123456', dir);
      expect(res.type).toBe('SUITEAPP');
      expect(res.dir).toContain(`${ dir }/123456.666`);
      expect(res.filebase).toContain(`${ dir }/123456.666/FileCabinet/SuiteApps`);
      expect(res.name).toBe('123456.666');
      expect(res.values).toEqual({
        publisherId: '123456',
        id: '666',
        name: 'SuiteAppProject',
        version: '0.0.1'
      });
      expect(fs.existsSync(res.dir)).toBe(true);
      testDir = res.dir;
    });
  });

  describe('sdf', () => {
    it('should spawn the correct command and fail', () => {
      return index
        .sdf('listfiles', 'PassWord', { p: 'project', path: 'path' })
        .then(console.log)
        .catch(err => {
          expect(err.message).toContain('listfiles -p project -path path');
        });
    });

    it('should fail if command does not exist', () => {
      return index.sdf('foobar', 'PassWord', { p: 'project', path: 'path' }).catch(err => {
        expect(err.message).toBe('Command "foobar" not available in sdf cli');
      });
    });

    it('should throw an error if options are missing', () => {
      expect(() => index.sdf('listfiles', 'PassWord')).toThrowError('Parameter "options" is required!');
    });

    it('should throw an error if password is missing', () => {
      expect(() => index.sdf('listfiles')).toThrowError('Parameter "password" is required!');
    });
  });

  describe('sdfcli', () => {
    it('should call the sdfcli', () => {
      const res = execSync('./sdfcli').toString();
      expect(res).toContain('BUILD SUCCESS');
    });
  });
});
