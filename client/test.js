document.addEventListener('DOMContentLoaded', async () => {
    console.log('findResponse',
        {
            question: 'give me a cart',
            answer: await findResponse('give me a cart')
        });
    console.log('findResponse',
        {
            question: 'what is the average',
            answer: await findResponse('what is the average')
        });
    console.log('findResponse',
        {
            question: 'what is the median',
            answer: await findResponse('what is the median')
        });
    console.log('findResponse',
        {
            question: 'give me the standard deviation',
            answer: await findResponse('give me the standard deviation')
        });
    console.log('findResponse',
        {
            question: 'what is the trend',
            answer: await findResponse('what is the trend')
        });
    console.log('findResponse',
        {
            question: 'what is the greatest value',
            answer: await findResponse('what is the greatest value')
        });
    console.log('findResponse',
        {
            question: 'what is the minimum value',
            answer: await findResponse('what is the min value')
        });
    // console.log('findResponse',
    //     {
    //         question: 'please restart',
    //         answer: await findResponse('please restart')
    //     });
    console.log('findResponse',
        {
            question: 'tell me the range',
            answer: await findResponse('tell me the range')
        });
    console.log('findResponse',
        {
            question: 'show me the variance',
            answer: await findResponse('show me the variance')
        });
    console.log('options', options);
    // console.log(predict('past ten years'));


    getData("show me the data of 1989 from the chart");

    async function getData(sentence) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({sentence})
        }
        const response = await fetch('/api', options);
        const text = await response.text();
        console.log(parseInt(JSON.parse(text).prediction));
    }
});
