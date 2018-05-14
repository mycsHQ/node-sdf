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

  describe('sdfCreateAccountCustomisationProject', () => {
    const accountCustomisationProject = 'AccountCustomisationProject';

    it('should throw an error if name is missing', () => {
      expect(() => index.sdfCreateAccountCustomisationProject()).toThrowError('Parameter "name" is required!');
    });

    it('should create account customisation project', () => {
      const res = index.sdfCreateAccountCustomisationProject(accountCustomisationProject);
      expect(res.type).toBe('Account customisation project');
      expect(res.dir).toContain(`/${ accountCustomisationProject }`);
      expect(res.name).toBe(accountCustomisationProject);
      expect(res.values).toEqual({ name: accountCustomisationProject });
      expect(fs.existsSync(res.dir)).toBe(true);
      console.log(res);
      testDir = res.dir;
    });

    it('should create account customisation project in dir', () => {
      const dir = '.dependencies';
      const res = index.sdfCreateAccountCustomisationProject(accountCustomisationProject, dir);
      expect(res.type).toBe('Account customisation project');
      expect(res.dir).toContain(`/${ dir }/${ accountCustomisationProject }`);
      expect(res.name).toBe(accountCustomisationProject);
      expect(res.values).toEqual({ name: accountCustomisationProject });
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

    it('should create suite app project', () => {
      const res = index.sdfCreateSuiteAppProject(suiteAppProject, '666', '0.0.1', '123456');
      expect(res.type).toBe('SuiteApp project');
      expect(res.dir).toContain('/123456.666');
      expect(res.name).toBe('123456.666');
      expect(res.values).toEqual({
        publisherId: '123456',
        id: '666',
        name: 'SuiteAppProject',
        version: '0.0.1'
      });
      expect(fs.existsSync(res.dir)).toBe(true);
      console.log(res);
      testDir = res.dir;
    });

    it('should create suite app project in dir', () => {
      const dir = '.dependencies';
      const res = index.sdfCreateSuiteAppProject(suiteAppProject, '666', '0.0.1', '123456', dir);
      expect(res.type).toBe('SuiteApp project');
      expect(res.dir).toContain(`${ dir }/123456.666`);
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
      return index.sdf('listfiles', 'PassWord', { p: 'project', path: 'path' }).catch(err => {
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
});
