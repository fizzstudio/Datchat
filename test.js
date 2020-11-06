document.addEventListener('DOMContentLoaded', async () => {
    console.log('findResponse',
        {
            question: 'give me a cable',
            answer: await findResponse('give me a cable')
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
    console.log('options', options)
});
