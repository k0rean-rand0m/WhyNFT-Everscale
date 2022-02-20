const server = 'https://whynft.ru/api/';
let token = null;

async function serverRequest(json = {}, onPopup) {
    return fetch(server, {
            method: 'POST',
            body: JSON.stringify(json),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
        .catch((error) => {
            const errText = error.toString();
            // Error: Network Error
            // Error: Request failed with status code 400
            // Error: Request failed with status code 429
            let errCode;
            if (errText === 'Error: Request failed with status code 429') {
                errCode = 429;
                onPopup('error', 'Слишком много запросов, попробуй позже');
            } else if (errText === 'Error: Network Error') {
                errCode = 'network';
                onPopup('error', 'Нет доступа к интернету, попробуй позже');
            } else {
                errCode = 400;
                onPopup('error', 'Что-то пошло не так, попробуй еще раз');
            }
            return {
                error: errCode,
                data: errText,
            };
        });
}

export default function api(method, params = {}, onPopup) {
    return new Promise((resolve, reject) => {
        const json = {
            method,
            params,
        };

        serverRequest(json, onPopup).then(async (responce) => {
            const res = await responce.json();
            if (res.error !== 0) {
                reject(res.data);
            } else if (res.data === undefined) {
                resolve({});
            } else {
                if (res.data.token) {
                    token = res.data.token;
                }
                resolve(res.data);
            }
        });
    });
}