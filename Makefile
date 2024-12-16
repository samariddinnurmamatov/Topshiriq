build-push:
	docker build --rm -t Topshiriq:1 -f Dockerfile .
	docker push Topshiriq:1


pull-run: 
	docker pull Topshiriq:1 && \
	docker run --rm --net bridge -p 8000:8000 --name Topshiriq -d Topshiriq:1 && \
