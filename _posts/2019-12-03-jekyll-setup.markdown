---
layout: post
title:  "Jekyll Setup!"
date:   2019-12-03 00:10:07 -0800
categories: jekyll update
---

Documenting the steps I used to install the Jekyll:

{% highlight ruby %}
  626  gem "minimal-mistakes-jekyll"
  627  apt install ruby
  628  apt-get update
  629  apt install ruby
  630  bundle
  631  apt install ruby-bundler
  632  bundle
  633  apt-get update
  634  sudo bundle
  635  theme: minimal-mistakes-jekyll
  636  bundle
  637  ls
  638  ls -l
  639  gem install jekyll bundler
  640  ls -l
  641  jekyll new devang_myblog
  642  apt install jekyll
  643  jekyll new devang_myblog
  644  cd devang_myblog/
  645  bundle exec jekyll serve
  646  sudo apt-get install ruby-full build-essential zlib1g-dev
  647  echo '# Install Ruby Gems to ~/gems' >> ~/.bashrc
  648  echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc
  649  echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc
  650  source ~/.bashrc
  651  gem install jekyll bundler
  652  pwd
  653  bundle exec jekyll serve
  654  bundle exec jekyll build
  655  bundler exec jekyll build
  656  bundle exec jekyll serve
  657  bundle exec
  658  bundle exec jekyll
  659  bundle install
  660  history
  661  pwd
  662  bundle install
  663  ls -l
  664  gem update --system
  665  bundle install
  666  bundle exec jekyll serve
  667  bundle init      <<<<<<<<<<<<<<<<<<<<<<<<<<<< had to do this to make next command to work
  668  bundle exec jekyll serve
  669  ls -l
  670  cd _posts/
  671  ls -l
  672  less 2019-12-01-welcome-to-jekyll.markdown
  673  vi 2019-12-01-welcome-to-jekyll.markdown
  674  bundle exec jekyll serve
  675  ls -l
  676  ls -l _site/
  677  cat _site/2019-12-01-welcome-to-jekyll.html
  678  pwd
  679  cd ..
  680  ls -l
  681  cat _config.yml
  682  vi _config.yml
  683  bundle exec jekyll serve
  684  vi _config.yml
  685  bundle exec jekyll serve
  686  cat _config.yml
  687  vi _config.yml
  688  bundle exec jekyll serve
  689  cat _config.yml
  690  vi _config.yml
  691  bundle exec jekyll serve
  692  vi _config.yml
  693  bundle exec jekyll serve
  694  ls -l
  695  cd _posts/
  696  ls -l
  697  cat 2019-12-01-welcome-to-jekyll.markdown
  698  history
depatel>


	627  apt install ruby
	628  apt-get update
	629  apt install ruby
	630  bundle
	631  apt install ruby-bundler
	632  bundle
	633  apt-get update
	639  gem install jekyll bundler
	642  apt install jekyll
	643  jekyll new devang_myblog
	662  bundle install
	667  bundle init 
	668  bundle exec jekyll serve
	bundle exec jekyll serve --host=0.0.0.0
{% endhighlight %}

Check out the [Jekyll docs][jekyll-docs] for more info on how to get the most out of Jekyll. File all bugs/feature requests at [Jekyll’s GitHub repo][jekyll-gh]. If you have questions, you can ask them on [Jekyll Talk][jekyll-talk].

[jekyll-docs]: http://jekyllrb.com/docs/home
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-talk]: https://talk.jekyllrb.com/
