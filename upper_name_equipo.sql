UPDATE public."Equipos"
SET "Nombre" = UPPER("Nombre");

UPDATE public."Equipos"
SET "Nombre" = REPLACE(UPPER("Nombre"), ' ', '');


select * from public."Equipos" where "Nombre" = 'AMASAMO'

DELETE FROM public."Equipos"
WHERE "Nombre" = 'AMASAMO';