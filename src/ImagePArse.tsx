import React, {useEffect, useState} from 'react';
//
//
// const MyComponent = () => {
//
//     const [imageUrl, setImageUrl] = useState<string | null>(null);
//     // const [html, setHtml] = useState<string>('');
//
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await fetch('https://docs.google.com/spreadsheets/d/1WXp4jZQYbV7a8TG_Merpc6dQ-YuZbYxZC_In6ny5Qkg/edit#gid=256578302');
//                 const htmlString = await response.text();
//                 // setHtml(htmlString)
//                 const parser = new DOMParser();
//                 const doc = parser.parseFromString(htmlString, 'text/html');
//
//                 let imgElements = doc.getElementsByTagName('img')[0].getAttribute('src');
//                 // const imgTags = Array.from(imgElements).map(img => img.outerHTML);
//
//                 setImageUrl(imgElements);
//             } catch (error) {
//                 console.error('Error fetching or parsing the HTML:', error);
//             }
//         };
//         fetchData();
//     }, []);
//
//     // const parseTableAndFindImage = (htmlString: string) => {
//     //     const parser = new DOMParser();
//     //     const doc = parser.parseFromString(htmlString, 'text/html');
//     //
//     //     const tbody = doc.querySelector('tbody');
//     //     const rows = tbody!.querySelectorAll('tr');
//     //
//     //     let imgRowIndex = -1;
//     //     let imgCellIndex = -1;
//     //
//     //     rows.forEach((row, rowIndex) => {
//     //         const cells = row.querySelectorAll('td');
//     //
//     //         cells.forEach((cell, cellIndex) => {
//     //             if (cell.innerHTML.includes('<img')) {
//     //                 imgRowIndex = rowIndex;
//     //                 imgCellIndex = cellIndex;
//     //             }
//     //         });
//     //     });
//     //
//     //     // Преобразование индекса столбца в буквенное представление (A, B, C и т.д.)
//     //     const imgCellLetter = String.fromCharCode(65 + imgCellIndex);
//     //
//     //     const result = {
//     //         rowIndex: imgRowIndex + 1,
//     //         cellIndex: `${imgCellLetter}${imgRowIndex + 1}`,
//     //     };
//     //
//     //     return result;
//     // };
//     //
//     // if (html !== '') {
//     //     const result = parseTableAndFindImage(html);
//     //     console.log(result);
//     // }
//
//
//     return (
//         <div>
//             <h2>Image Url</h2>
//             <ul>
//                 {imageUrl && <img src={imageUrl} alt=""/>}
//             </ul>
//         </div>
//     );
// };
//
// export default MyComponent;
