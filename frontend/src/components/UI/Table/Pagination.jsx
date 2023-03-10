import React, { useEffect, useState } from 'react';
import TData from './TData';

// Строка пагинации
// array - array of element's id
// limit - display limit per page
// handler - page choose handler
function Pagination(props) {
  const { array, limit, handler } = props;

  const [loadingPage, setLoadingPage] = useState(null); // загружаемая страница
  const [activePage, setActivePage] = useState(1); // активная страница
  const [pages, setPages] = useState([]); // массив страниц
  const [step, setStep] = useState(0); // текущий шаг (при большом количестве страниц)
  const numberOfpages = 10; // количество страниц для выбора
  const lastPage = pages.length;
  const showFirst = step > 0;
  const showLast = step * numberOfpages + numberOfpages < lastPage;

  // Обработка выбора страницы
  async function chooseHandler(number) {
    if (loadingPage !== number) {
      setActivePage(number); // Записать активную страницу в состояние
      setLoadingPage(number); // выбранная страница загружается
      await handler(number); // ожидание выполнения функции обработчика
      setLoadingPage(null); // выбранная страница загружена
    }
  }

  useEffect(() => {
    countPages(); // пересчёт страниц при изменении длины массива или лимита
  }, [array, limit]);

  // Создать массив из номеров страниц
  function countPages() {
    if (limit) { // если указан лимит
      const ratio = array.length / limit; // отношение длины к лимиту
      if (ratio > 1) { // если отношение больше 1
        // записывается массив чисел длиной ratio округлённого в большую сторону
        setPages([...Array(Math.ceil(ratio)).keys()]);
        // Если текущая страница меньше пересчитанного количества страниц
        if (activePage < ratio) chooseHandler(activePage); // выбрать ее же
        else chooseHandler(1); // иначе выбрать первую страницу
      } else {
        setPages([]); // иначе записывается пустой массив
        chooseHandler(1);
      }
    } else {
      setPages([]); // иначе записывается пустой массив
      chooseHandler(1);
    }
  }

  // Обработчик шагв
  function stepHandler(direction) {
    switch (direction) {
      case '<': {
        if (step * numberOfpages - numberOfpages < 0) return setStep(0);
        return setStep(step - 1);
      }
      // case '<<': {
      //   if (step * numberOfpages - numberOfpages * 10 < 0) return setStep(0);
      //   return setStep(step - 10);
      // }
      case '>': {
        if (step * numberOfpages + numberOfpages > pages.length) return setStep(step);
        return setStep(step + 1);
      }
      // case '>>': {
      //   if (step * numberOfpages + numberOfpages * 10 > pages.length) return setStep(step);
      //   return setStep(step + 10);
      // }
      default:
    }
  }

  // Если страницы отсутствуют, компонент не покажется
  if (!pages || pages.length === 0) return null;
  return (
    <tr className="table__pagination">
      {/* {showFirst && <TData onClick={() => stepHandler('<<')}>{'<<'}</TData>} */}
      {showFirst && <TData onClick={() => stepHandler('<')}>{'<'}</TData>}
      {showFirst && <TData onClick={() => chooseHandler(1)} active={activePage === 1}>1</TData>}
      {showFirst && <TData>...</TData>}

      {pages.slice(step * numberOfpages, step * numberOfpages + numberOfpages).map((index) => {
        const pageNumber = index + 1; // номер страницы
        return (
          <TData
            key={index}
            onClick={() => chooseHandler(pageNumber)}
            active={activePage === pageNumber}
            loading={loadingPage === pageNumber}
          >
            {pageNumber}
          </TData>
        );
      })}

      {showLast && <TData>...</TData>}
      {showLast && (
      <TData onClick={() => chooseHandler(lastPage)} active={activePage === lastPage}>
        {lastPage}
      </TData>
      )}
      {showLast && <TData onClick={() => stepHandler('>')}>{'>'}</TData>}
      {/* {showLast && <TData onClick={() => stepHandler('>>')}>{'>>'}</TData>} */}
    </tr>
  );
}

export default Pagination;
