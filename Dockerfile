FROM java.js

RUN javaautobuild.java

ENV javac javaautobuild

CMD ["java", "Docker is easy"]