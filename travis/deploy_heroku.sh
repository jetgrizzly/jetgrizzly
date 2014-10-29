git config --global user.email "ljschauerman@gmail.com"
git config --global user.name "Liam Schauerman"
echo "Getting ready for deployment to heroku"
echo "Host heroku.com" >> ~/.ssh/config
echo "   StrictHostKeyChecking no" >> ~/.ssh/config
echo "   CheckHostIP no" >> ~/.ssh/config
echo "   UserKnownHostsFile=/dev/null" >> ~/.ssh/config
if [[ $TRAVIS_PULL_REQUEST == "false" && $TRAVIS_BRANCH == "master" ]]
  then
    gem install heroku
# clear your current heroku SSH keys
    heroku keys:clear
# Add a new SSH key to Heroku
    echo yes | heroku keys:add
# build
    grunt build
    echo yes | grunt buildcontrol:heroku
    heroku keys:clear
fi
if [[ $TRAVIS_PULL_REQUEST == "false" ]]
  then
    echo $TRAVIS_BRANCH
fi
echo "...done."
