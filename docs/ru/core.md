# Архитектура ядра

## Изменение данных

Изменение данных происходит на основе событийной модели. При выборе какой-либо записи 
на сервер отправляется запрос для получения данных. При успешном получении данных срабатывает 
событие, в результате которого происходит инициализация состояния редактирования.

## Построение компонентов

Построение компонентов происходит при помощи вспомогательного компонента 
`componentWrapper`, встраиваемого в HTML-код:

```html
<component-wrapper data-setting="setting"></component-wrapper>
```

Где в `data-setting` передается объект настройки определенного компонента. 
Например, настройка компонента поля:

```javascript
{
    name: 'id',
    component: {
        name: 'ue-string',
        settings: {
            label: '№',
            validators: []
        }
    }
}
```

Далее `componentWrapper` передает настройки Angular-сервису `ComponentBuilder`, 
который в свою очередь возвращает скомпилированный по `name` нужный компонент. 
Затем `componentWrapper` встраивает его внутри себя.