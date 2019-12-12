---
layout: post
title:  "Jekyll Setup!"
date:   2019-12-03 00:10:07 -0800
categories: jekyll update
---

Documenting the steps I used to install the Jekyll:
[Documented on my existing blog](https://devangnp.blogspot.com/2019/12/trying-out-jekyll-static-web-page-site.html)


{% highlight ruby %}


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
