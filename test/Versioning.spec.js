import path from 'path';
import DetermineTargetsFromConfig, { Versioning } from '../src/Versioning';
import multiEnvPackageJSON from './multi-config.package.json';
import singleArrayEnvPackageJSON from './single-array-config.package.json';
import singleVersionEnvPackageJSON from './single-version-config.package.json';

describe('Versioning', () => {
  it('should support multi env config in browserslist package.json', () => {
    const config = DetermineTargetsFromConfig(
      '.',
      multiEnvPackageJSON.browsers
    );
    const result = Versioning(config);
    expect(result).toMatchSnapshot();
  });

  it('should support resolving browserslist config in subdirectory', () => {
    // This should resolve the ./test/.browserslistrc config
    const relativeConfig = DetermineTargetsFromConfig(
      path.join(__dirname, '.browserslistrc')
    );
    const rootConfig = DetermineTargetsFromConfig(
      require.resolve('../package.json')
    );
    const relativeConfigVersions = Versioning(relativeConfig);
    expect(relativeConfigVersions).toMatchSnapshot();
    const rootConfigVersions = Versioning(rootConfig);
    expect(rootConfigVersions).toMatchSnapshot();

    expect(relativeConfigVersions).not.toEqual(rootConfigVersions);
  });

  it('should support single array config in browserslist package.json', () => {
    const config = DetermineTargetsFromConfig(
      '.',
      singleArrayEnvPackageJSON.browsers
    );
    const result = Versioning(config);
    expect(result).toMatchSnapshot();
  });

  it('should support single version config in browserslist package.json', () => {
    const config = DetermineTargetsFromConfig(
      '.',
      singleVersionEnvPackageJSON.browsers
    );
    const result = Versioning(config);
    expect(result).toMatchSnapshot([
      { target: 'safari', version: '8', parsedVersion: 8 },
      { target: 'ie', version: '9', parsedVersion: 9 },
      { target: 'firefox', version: '20', parsedVersion: 20 },
      { target: 'chrome', version: '32', parsedVersion: 32 }
    ]);
  });

  it('should get lowest target versions', () => {
    const versions = [
      'chrome 20',
      'chrome 30',
      'node 7',
      'chrome 30.5',
      'firefox 50.5'
    ];
    expect(Versioning(versions)).toMatchSnapshot();
  });

  it('should support string config in rule option', () => {
    const config = DetermineTargetsFromConfig('.', 'defaults, not ie < 9');
    const result = Versioning(config);
    expect(result).toMatchSnapshot();
  });
});
