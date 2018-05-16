#!/usr/bin/env bash

echo ""
echo "Setting up wrapped clis"
echo "(sdfcli, sdfcli-createproject)"
echo ""

(which wget || ( which brew && brew install wget || which apt-get && apt-get install wget || which yum && yum install wget || which choco && choco install wget)) >/dev/null 2>&1
(which tar || ( which brew && brew install gnu-tar || which apt-get && apt-get install tar || which yum && yum install tar || which choco && choco install tar)) >/dev/null 2>&1
(which find || ( which brew && brew install findutils || which apt-get && apt-get install findutils || which yum && yum install findutils || which choco && choco install findutils)) >/dev/null 2>&1
(which sed || ( which brew && brew uninstall gnu-sed && brew install gnu-sed --with-default-names || which apt-get && apt-get install sed || which yum && yum install sed || which choco && choco install sed)) >/dev/null 2>&1
(which unzip || ( which brew && brew install unzip || which apt-get && apt-get install unzip || which yum && yum install unzip || which choco && choco install unzip)) >/dev/null 2>&1

PARENT_DIR=$(pwd)
DEPS_DIR=$PARENT_DIR/.dependencies

mkdir -p $DEPS_DIR
cd $DEPS_DIR
# download all paths from urls file check content-disposition header for name and skip if file exists
wget -i $PARENT_DIR/urls --content-disposition -nc -q --show-progress

for filename in *.tar.gz
do
  tar -zxf $filename
done

for filename in *.jar
do
  unzip -oq $filename
done

NODE_MODULES=$PARENT_DIR/node_modules
if [ ! -d "$NODE_MODULES" ]; then
  # is installed as npm package
  NODE_MODULES=$(find $(echo $(cd ../.. && pwd)) -maxdepth 1 -type d -name 'node_modules')
fi

JRE_DIR=$NODE_MODULES/node-jre/jre
JAVA_DIR=$(find $JRE_DIR -maxdepth 1 -type d -name 'jre*.*')
JAVA_HOME="$JAVA_DIR/Contents/Home"

if [ ! -d "$JAVA_HOME" ]; then
  # is installed on linux
  JAVA_HOME=$JAVA_DIR
fi

MAVEN_DIR=$(find $DEPS_DIR -maxdepth 1 -type d -name '*maven*')
MAVEN_BIN=$MAVEN_DIR/bin/mvn

# rewrite sdfcli script
sed -i -e "s|/webdev/sdf/sdk/|$DEPS_DIR|" $DEPS_DIR/sdfcli
sed -i -e "s|mvn|JAVA_HOME=$JAVA_HOME $MAVEN_BIN|" $DEPS_DIR/sdfcli

# create symlinks
rm -f $PARENT_DIR/sdfcli $PARENT_DIR/sdfcli-createproject
ln -s $DEPS_DIR/sdfcli $PARENT_DIR/sdfcli
ln -s $DEPS_DIR/sdfcli-createproject $PARENT_DIR/sdfcli-createproject

./sdfcli >/dev/null 2>&1

echo ""
echo "Setup completed"
echo ""