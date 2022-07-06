var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import { useState, useEffect } from 'react';
import { XIcon } from '@heroicons/react/solid';
import LongButton from '../../../../components/buttons/LongButton';
import { API_ORIGIN } from '../../../../constants';

export default function CodeForm(_ref) {
    var metrics = _ref.metrics,
        viewMetrics = _ref.viewMetrics,
        event = _ref.event,
        setFormVisible = _ref.setFormVisible;

    var _useState = useState([]),
        _useState2 = _slicedToArray(_useState, 2),
        codeTypes = _useState2[0],
        setCodeTypes = _useState2[1];

    var _useState3 = useState(''),
        _useState4 = _slicedToArray(_useState3, 2),
        codeInput = _useState4[0],
        setCodeInput = _useState4[1];

    var _useState5 = useState(''),
        _useState6 = _slicedToArray(_useState5, 2),
        coderInput = _useState6[0],
        setCoderInput = _useState6[1];

    var _useState7 = useState(''),
        _useState8 = _slicedToArray(_useState7, 2),
        notesInput = _useState8[0],
        setNotesInput = _useState8[1];

    var _useState9 = useState(false),
        _useState10 = _slicedToArray(_useState9, 2),
        saving = _useState10[0],
        setSaving = _useState10[1];

    var _useState11 = useState(false),
        _useState12 = _slicedToArray(_useState11, 2),
        newCodeToggle = _useState12[0],
        setNewCodeToggle = _useState12[1];

    var _useState13 = useState(''),
        _useState14 = _slicedToArray(_useState13, 2),
        newCodeInput = _useState14[0],
        setNewCodeInput = _useState14[1];

    useEffect(function () {
        fetchCodeTypes();

        console.log(event);
    }, []);

    var fetchCodeTypes = function fetchCodeTypes() {
        fetch(API_ORIGIN + '/coding/game/' + metrics.game + '/codes').then(function (res) {
            return res.json();
        }).then(function (data) {
            console.log(data.val);
            setCodeTypes(data.val);
        });
    };

    var formValidation = function formValidation() {
        // check for valid err code


        // check for non-empty coder name


        return true;
    };

    var submit = function submit() {
        console.log(codeInput);

        // fetch(`${API_ORIGIN}/coding/game/${metrics.game}/player/${viewMetrics.player}/session/${event.sessionID}/index/<index>/code/${codeInput}`,
        //     {
        //         method: 'POST',
        //         body: JSON.stringify({
        //             code: newCodeToggle ? newCodeInput : codeInput,
        //             coder: coderInput,
        //             note: notesInput
        //         })
        //     })
        //     .then(res => res.json())
        //     .then(data => {
        //         console.log(data)

        // update list of error codes
        // fetchCodeTypes()

        //         // if POST succeeds
        //         setNotesInput('')

        //     })
        //     .catch(err => {
        //         alert(err)

        //     })

        setTimeout(function () {
            setFormVisible(false);
        }, 1000);
    };

    return React.createElement(
        'div',
        { className: ' bg-white fixed top-14 right-3 p-3 w-content border shadow-sm' },
        React.createElement(
            'div',
            { className: 'flex justify-between' },
            React.createElement(
                'h3',
                { className: 'text-md' },
                'Detector Tagging'
            ),
            React.createElement(XIcon, { className: 'cursor-pointer h-5 w-5', onClick: function onClick() {
                    return setFormVisible(false);
                } })
        ),
        React.createElement(
            'div',
            null,
            React.createElement(
                'h3',
                { className: 'text-lg font-bold' },
                event.type
            ),
            React.createElement(
                'h3',
                { className: 'text-lg font-bold' },
                '@',
                event.name
            )
        ),
        React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
                'div',
                { className: 'mb-5' },
                React.createElement(
                    'div',
                    { className: 'col mb-2' },
                    React.createElement(
                        'div',
                        { className: 'input-group-prepend' },
                        React.createElement(
                            'h4',
                            { className: 'text-sm' },
                            'Code'
                        )
                    ),
                    !newCodeToggle ? React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'select',
                            { className: 'form-select block w-full mt-1', value: codeInput, onChange: function onChange(e) {
                                    return setCodeInput(e.target.value);
                                } },
                            codeTypes && codeTypes.map(function (type, i) {
                                return React.createElement(
                                    'option',
                                    { key: i, value: type },
                                    type
                                );
                            })
                        ),
                        React.createElement(LongButton, {
                            label: '+ new',
                            action: function action() {
                                setNewCodeToggle(true);
                            }
                        })
                    ) : React.createElement('input', {
                        type: 'text',
                        className: 'block w-full',
                        value: newCodeInput,
                        onChange: function onChange(e) {
                            return setNewCodeInput(e.target.value);
                        }
                    })
                ),
                React.createElement(
                    'div',
                    { className: 'col mb-2' },
                    React.createElement(
                        'div',
                        { className: 'input-group-prepend' },
                        React.createElement(
                            'h4',
                            { className: 'text-sm' },
                            'Coder'
                        )
                    ),
                    React.createElement('input', { type: 'text', className: 'block w-full', value: coderInput, onChange: function onChange(e) {
                            return setCoderInput(e.target.value);
                        } })
                ),
                React.createElement(
                    'div',
                    { className: 'col' },
                    React.createElement(
                        'div',
                        { className: 'input-group-prepend' },
                        React.createElement(
                            'h4',
                            { className: 'text-sm' },
                            'Notes'
                        )
                    ),
                    React.createElement('textarea', { className: 'block w-full', value: notesInput, onChange: function onChange(e) {
                            return setNotesInput(e.target.value);
                        } })
                )
            )
        ),
        React.createElement(
            'div',
            { className: 'flex' },
            React.createElement(LongButton, {
                label: 'Save',
                action: submit,
                selected: true
            }),
            saving && React.createElement(
                'h4',
                { className: 'text-sm' },
                'Saving'
            )
        )
    );
}