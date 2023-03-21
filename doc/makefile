######################
#      Makefile      #
######################

filename=main

pdf: 
	xelatex ${filename}
	xelatex ${filename}

text: html
	html2text -width 100 -style pretty ${filename}/${filename}.html | sed -n '/./,$$p' | head -n-2 >${filename}.txt

html:
	@#latex2html -split +0 -info "" -no_navigation ${filename}
	htlatex ${filename}

view:
	while inotifywait --event modify,move_self,close_write ${filename}.tex; \
		do xelatex -halt-on-error ${filename} &&   xelatex -halt-on-error \
		${filename}; done

clean:
	rm -f ${filename}.{ps,pdf,log,aux,out,dvi,bbl,blg,snm,toc,nav}

.PHONY: build
build:
	docker run --rm -v $(shell pwd):/data moss/xelatex make
	
open:
	docker run --rm -it -v $(shell pwd):/data moss/xelatex /bin/bash

	# docker run --rm -it -v /home/daniel/dev/stin-projekt/doc:/data moss/xelatex /bin/bash

req: 
	apt update
	apt install python3-pip
	apt install biblatex

	apt install texlive-bibtex-extra

open2