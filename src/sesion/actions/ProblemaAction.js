export const obtenerDataAnterior = (Firebase, paginaSize, problemaInicial, texto) => {
    return new Promise(async (resolve, eject) => {
        let problemas = Firebase.db
            .collection("Problemas")
            .orderBy("titulo")
            .limit(paginaSize);
        if (problemaInicial !== null) {
            problemas = Firebase.db
                .collection("Problemas")
                .orderBy("titulo")
                .startAt(problemaInicial)
                .limit(paginaSize);
            if (texto.trim() !== "") {
                problemas = Firebase.db
                    .collection("Problemas")
                    .orderBy("titulo")
                    .where("keywords", "array-contains", texto.toLowerCase())
                    .startAt(problemaInicial)
                    .limit(paginaSize);
            }
        }
        const snapshot = await problemas.get();
        const arrayProblemas = snapshot.docs.map(doc => {
            let data = doc.data();
            let id = doc.id;
            return { id, ...data }
        })
        const inicialValor = snapshot.docs[0];
        const finalValor = snapshot.docs[snapshot.docs.length - 1];
        const returnValue = {
            arrayProblemas,
            inicialValor,
            finalValor
        }
        resolve(returnValue)
    })
}

export const obtenerData = (Firebase, paginaSize, problemaInicial, texto) => {
    return new Promise(async (resolve, eject) => {
        let problemas = Firebase.db
            .collection("Problemas")
            .orderBy("titulo")
            .limit(paginaSize);
        if (problemaInicial !== null) {
            problemas = Firebase.db
                .collection("Problemas")
                .orderBy("titulo")
                .startAfter(problemaInicial)
                .limit(paginaSize);
            if (texto.trim() !== "") {
                problemas = Firebase.db
                    .collection("Problemas")
                    .orderBy("titulo")
                    .where("keywords", "array-contains", texto.toLowerCase())
                    .startAfter(problemaInicial)
                    .limit(paginaSize);
            }
        }
        const snapshot = await problemas.get();
        const arrayProblemas = snapshot.docs.map(doc => {
            let data = doc.data();
            let id = doc.id;
            return { id, ...data }
        })
        const inicialValor = snapshot.docs[0];
        const finalValor = snapshot.docs[snapshot.docs.length - 1];
        const returnValue = {
            arrayProblemas,
            inicialValor,
            finalValor
        }
        resolve(returnValue)
    })
}