# MDS Package Explorer: Project Instructions History

This document compiles the chronological history of all instructions and requests provided across all sessions dedicated to the **MDS Package Explorer** project.

---

## Session 1: Initial Package Scraper & Downloader
* **Session ID:** `447ed79f-88e7-495d-940f-8ae61f71fcf9`
* **Start Date:** 2026-06-20

### Chronological Requests:
1. **Request 1:** 
   > Si te doy una dirección html puedes descargar los documentos en ella y colocarlos en una carpeta?
2. **Request 2:** 
   > Crea una carpeta llamada focusedMDS con la información y documentos que encuentres en la siguiente dirección: https://cran.r-project.org/web/packages/focusedMDS/index.html
3. **Request 3:** 
   > Has lo mismo para la siguiente dirección, pero descarga los binarios para Windows y Mac, la carpeta se debe llamar bayMDS: https://cran.r-project.org/web/packages/bayMDS/index.html
4. **Request 4:** 
   > Con la siguiente dirección, sigue el mismo procedimiento pero esta vez determina el nombre para la carpeta: https://cran.r-project.org/web/packages/bigmemory/index.html
5. **Request 5 (Constraint clarification):** 
   > Persiste la descarga de los binarios de Windows y Mac cuando explicitamente dije que no. Como lo podemos solucionar?
6. **Request 6:** 
   > Con la siguiente dirección, sigue el mismo procedimiento: https://cran.r-project.org/web/packages/bios2mds/index.html
7. **Request 7:** 
   > Yo los borrare. Gracias
8. **Request 8:** 
   > Procedamos con la siguiente dirección:
9. **Request 9:** 
   > https://cran.r-project.org/web/packages/DistatisR/index.html
10. **Request 10:** 
    > Proceder con la siguiente dirección:

---

## Session 2: Additional Packages & Initial Analysis
* **Session ID:** `947b9805-65ce-422a-abfb-344a667c9cc2`
* **Start Date:** 2026-06-20 / 2026-06-21

### Chronological Requests:
1. **Request 1:** 
   > Proceder con la siguiente dirección:https://cran.r-project.org/web/packages/fmds/index.html
2. **Request 2:** 
   > Procedamos con la siguiente dirección. Pero sin descargar los binarios para windows o macOS: https://cran.r-project.org/web/packages/MDSMap/index.html
3. **Request 3:** 
   > Procedamos igual con la siguiente dirección: https://cran.r-project.org/web/packages/MDSPCAShiny/index.html
4. **Request 4:** 
   > Procedamos con https://cran.r-project.org/web/packages/pams/index.html
5. **Request 5:** 
   > Proceder con: https://cran.r-project.org/web/packages/semds/index.html
6. **Request 6:** 
   > Proceder con: https://cran.r-project.org/web/packages/smacof/index.html
7. **Request 7:** 
   > Proceder con: https://cran.r-project.org/web/packages/smacofx/index.html
8. **Request 8:** 
   > Elabora un documento de texto con todos los elementos en común que encuentres en una revisión inicial de los archivos index.html de todas las direcciones procesadas.

---

## Session 3: Web Application & Repository Integration
* **Session ID:** `b5fb948c-c812-4774-86f3-acfcfc346b06` (Current Session)
* **Start Date:** 2026-06-23

### Chronological Requests:
1. **Request 1 (Core Web App):** 
   > Please build a web application for me using Python Flask and plain vanilla HTML, JavaScript and CSS that fetches the R Cran Packages about Multidimensional Scanlling from (https://cran.r-project.org/web/packages/available_packages_by_name.html) and shows them to me. 
   > 
   > A simple refresh button with a spinner is good enough, anytime I'd like to refresh the details. 
   > 
   > I would also like the ability to take any specific update, select it and then Tweet about it.
2. **Request 2 (CSV Version Checking & Downloads):** 
   > Modificar la aplicación de Python, para que se genere un archivo csv con los nombres de los paquetes y la versión de los mismos. Cada vez que se corra la aplicación este archivo debe ser actualizado. Si algún paquete tiene una versió nueva en relación a la existente en el archivo csv se debe descargar el paquete y todos los documentos relacionados con el mismo y colocarlos en una carpeta con el nombre del paquete. Todos los paquetes nuevos y ya existentes deben ser recolocados en una carpeta llamada mds_packages.
3. **Request 3 (Readme Homepage, Org Chart, and Detail Cards):** 
   > Anteriormente, generaste un documento resumen a partir de los archivos index.html de cada package. Actualizalo y colocalo como si fuera un readme en el inicio de la aplicación. Luego coloca un organigrama de las relaciones entre los paquetes y luego coloca la información que ya pusiste de cada paquete.
4. **Request 4 (CSV integration and Publication Dates):** 
   > Incluye dentro del readme la tabla csv, e incluye en ella la fecha de publicación de cada package.
5. **Request 5 (UN Language Translation):** 
   > Haz un boton para que la aplicación este en todos los idomas oficiales de las Naciones Unidas.
6. **Request 6:** 
   > Genera un archivo .gitignore
7. **Request 7 (Create GitHub Repo):** 
   > Great! I would now like to push all of this to a new repository in my GitHub account. I would like to name this repository "MDS Package Explorer".
8. **Request 8 (Recommendations):** 
   > Estamos empezando con este proyecto faltan muchas cosas. Posteriormente las iremos incorporando. Sin embargo, me gustaría conocer tus recomendaciones de pasos a seguir para este proyecto.
9. **Request 9:** 
   > Implementar. *(Implement initial recommendations)*
10. **Request 10 (Git Credentials - Username):** 
    > [REDACTED_USERNAME]
11. **Request 11 (Git Credentials - Password):** 
    > [REDACTED_PASSWORD]
12. **Request 12:** 
    > Implementar.
13. **Request 13:** 
    > Actualizar el archivo .gitignore
14. **Request 14:** 
    > Push all to the repository.
15. **Request 15 (Fine-grained PAT):** 
    > [REDACTED_GITHUB_PAT]
16. **Request 16:** 
    > Try again.
17. **Request 17:** 
    > Try again.
18. **Request 18 (Shutdown App):** 
    > Stop the app.
19. **Request 19 (Instructions compilation):** 
    > Can you create a document with all the instructions that I wrote you?
20. **Request 20:** 
    > I need the instructions for the same project of previous sessions.
21. **Request 21:**
    > Put the buttons below the text: "Discover R and Python packages for Multidimensional Scaling and related extensions"
22. **Request 22:**
    > Put a button or another symbol next to every section name to hide or show the section.
23. **Request 23:**
    > Put a new section with information about how to run R code in Python and viceversa. Put code examples with the packages smacof and scikit-learn.
24. **Request 24:**
    > Good Job.
25. **Request 25:**
    > Include a new section about "What is Multidimensional Scalling?" and anothe section of books about it.
26. **Request 26:**
    > Put the link to the buying site of every book. And put a index at the left side of the section.
27. **Request 27:**
    > Excuseme I wasn't clear about the index. The index is not about the books. I need a Index of all the section at the left side of the web app.
28. **Request 28:**
    > Remove the "Book Catalog index".
29. **Request 29:**
    > The formula in the section "Normalized Stress Formula (Stress-1):" doesn't see like a formula. What can you do?
30. **Request 30:**
    > Good Job. Sorry by the english gramatical errors. Every time a make a mistake, please make an observation.
31. **Request 31:**
    > Thanks.
32. **Request 32:**
    > Update the Github repository.

