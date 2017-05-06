import React, { Component } from "react";
import { connect } from "react-redux";

import {
    setVariables,
    nextStep,
    prevStep
} from "./action/toolbar_action";
import {
    drawEllipticParaboloid,
    drawLevelSurface,
    drawProjection
} from "../coordinate_axes/action/coordinate_axes_action";

const style = require("./toolbar.css");

const FIRST_STEP = 1;
const LAST_STEP = 3;

class Toolbar extends Component {

    constructor() {
        super();

        this.state = {
            show: true,
            a: 0,
            b: 0,
            c: 0,
            showDropdown: false
        }
    }

    componentWillReceiveProps(nextProps) {
        const { toolbar: { a, b }} = nextProps;

        this.setState({ a, b })
    }

    toggleToolbar = () => {
        this.setState({ show: !this.state.show });
    }

    onChangeVariableA = (e) => {
        this.setState({ a: e.target.value });
    }

    onChangeVariableB = (e) => {
        this.setState({ b: e.target.value });
    }

    onChangeVariableC = (e) => {
        this.setState({ c: e.target.value });
    }

    drawEllipticParaboloid = () => {
        const { a, b } = this.state;
        const variables = { a, b };

        this.props.setVariables(variables);
        this.props.drawEllipticParaboloid(a, b);
    }

    drawLevelSurface = () => {
        const { c } = this.state;
        const variables = { c };

        this.props.setVariables(variables);
        this.props.drawLevelSurface(c);
    }

    showDropdown = () => {
        this.setState({ showDropdown: !this.state.showDropdown })
    }

    getValue = (a, b) => {
        const variables = { a, b };

        return () => {
            this.props.setVariables(variables);
            this.setState({
                a,
                b,
                showDropdown: false
            })
        }
    }

    get stepFirst() {
        const { a, b, showDropdown } = this.state;

        return (
            <div>
                <h3 className={style["toolbar__content_title"]}>Определенно пололжительная функция Ляпнуова</h3>
                <span className={style["toolbar__determination"]}>
                    <strong>Определение.</strong> Функция V называется определенно положительной функцией Ляпунова тогда и только
                    тогда, когда выполняются следующие свойства:
                    <ul className={style["toolbar__determination_list"]}>
                        <li>
                            <span className={style["toolbar__determination_overline"]}>0</span> &isin; D
                            [<span className={style["toolbar__determination_overline"]}>0</span> = (0, 0, ..., 0)];
                        </li>
                        <li>
                            V(<span className={style["toolbar__determination_overline"]}>0</span>) = 0
                            (V – скалярная функция);
                        </li>
                        <li>
                            V(<span className={style["toolbar__determination_overline"]}>x</span>) > 0
                            &forall;x &isin; D, кроме x=<span className={style["toolbar__determination_overline"]}>0</span>);
                        </li>
                        <li>
                            V имеет частные производные (&exist;
                            <span className={style["toolbar__fraction"]}>
                                <span className={style["toolbar__fraction_numerator"]}>
                                    <span className={style["toolbar__numerator_content"]}>
                                        &part;V
                                    </span>
                                </span>
                                <span className={style["toolbar__fraction_denominator"]}>
                                    <span className={style["toolbar__denominator_content"]}>
                                        &part;x<sub>i</sub>
                                    </span>
                                </span>
                            </span>
                            <span> – частная производная);</span>
                        </li>
                        <li>
                            <span className={style["toolbar__fraction"]}>
                                <span className={style["toolbar__fraction_numerator"]}>
                                    <span className={style["toolbar__numerator_content"]}>
                                        &part;V
                                    </span>
                                </span>
                                <span className={style["toolbar__fraction_denominator"]}>
                                    <span className={style["toolbar__denominator_content"]}>
                                        &part;x<sub>i</sub>
                                    </span>
                                </span>
                            </span>
                            <span> &isin; C, то есть частные производные непрерывны.</span>
                        </li>
                    </ul>
                </span>
                <div
                    className={`
                        ${style["toolbar__dropdown-wrap"]}
                        ${showDropdown && style["toolbar__dropdown-wrap-active"]}
                    `}
                >
                    <span
                        className={style["toolbar__dropdown-wrap_selected"]}
                        onClick={this.showDropdown}
                    >
                        {a !== 1 && a}<span>x<sub>1</sub><sup>2</sup></span>
                        + {b !== 1 && b}<span>x<sub>2</sub><sup>2</sup></span>
                    </span>
                    { showDropdown &&
                        <ul className={style["toolbar__dropdown"]}>
                            <li
                                className={style["toolbar__dropdown_item"]}
                                onClick={this.getValue(1, 2)}
                            >
                                <span>x<sub>1</sub><sup>2</sup></span> + 2<span>x<sub>2</sub><sup>2</sup></span>
                            </li>
                            <li
                                className={style["toolbar__dropdown_item"]}
                                onClick={this.getValue(2, 3)}
                            >
                                2<span>x<sub>1</sub><sup>2</sup></span> + 3<span>x<sub>2</sub><sup>2</sup></span>
                            </li>
                        </ul>
                    }
                </div>
                <div className={style["toolbar__equation"]}>
                    <span>z = </span>
                    <input
                        type="text"
                        className={style["toolbar__equation_value"]}
                        value={a}
                        onChange={this.onChangeVariableA}
                    />
                    <span>x<sub>1</sub><sup>2</sup></span>
                    <span> + </span>
                    <input
                        type="text"
                        className={style["toolbar__equation_value"]}
                        value={b}
                        onChange={this.onChangeVariableB}
                    />
                    <span>x<sub>2</sub><sup>2</sup></span>
                </div>
                <button
                    className={style["toolbar__draw-btn"]}
                    onClick={this.drawEllipticParaboloid}
                >
                    Нарисовать
                </button>
            </div>
        );
    }

    get stepSecond() {
        const { a, b, c } = this.state;

        return (
            <div>
                <h3 className={style["toolbar__content_title"]}>Поверхность уровня</h3>
                <span className={style["toolbar__determination"]}>
                    <strong>Определение.</strong> Поверхностью уровня функции V называется множество
                    значений аргумента, для которых имеет место равенство V(x) = C.
                </span>
                <p className={style["toolbar__current-equation"]}>
                    <span>V = </span>
                    {a !== 1 && a}x<sub>1</sub><sup>2</sup> +
                    {b !== 1 && b}x<sub>2</sub><sup>2</sup>
                </p>
                <p>
                    <span>C = </span>
                    <input
                        type="text"
                        className={style["toolbar__equation_value"]}
                        onChange={this.onChangeVariableC}
                    />
                </p>
                <p>
                    {a !== 1 && a}x<sub>1</sub><sup>2</sup> +
                    {b !== 1 && b}x<sub>2</sub><sup>2</sup>
                    <span> = {c}</span>
                </p>
                <button
                    className={style["toolbar__draw-btn"]}
                    onClick={this.drawLevelSurface}
                >
                    Нарисовать
                </button>
                <button
                    className={style["toolbar__projection-btn"]}
                    onClick={this.props.drawProjection}
                >
                    Проекция
                </button>
            </div>
        );
    }

    content = () => {
        const { step } = this.props.toolbar;

        switch(step) {
            case 1:
                return this.stepFirst;
            case 2:
                return this.stepSecond;
            default:
                break;
        }
    }

    nextStep = () => {
        this.props.nextStep(this.props.toolbar.step);
    }

    prevStep = () => {
        this.props.prevStep(this.props.toolbar.step);
    }

    render() {
        const { show } = this.state;

        return (
            <div className={style['toolbar']}>
                { !show &&
                    <div className={style["toolbar__open"]} onClick={this.toggleToolbar}>
                        <span className={style["toolbar__open_line"]} />
                        <span className={style["toolbar__open_line"]} />
                        <span className={style["toolbar__open_line"]} />
                    </div>
                }
                { show &&
                    <div className={style["toolbar__content"]}>
                        <div className={style["clearfix"]}>
                            <div className={style["toolbar__close"]} onClick={this.toggleToolbar}>
                                <span className={style["toolbar__close_line"]} />
                                <span className={style["toolbar__close_line"]} />
                            </div>
                        </div>
                        {this.content()}
                        { this.props.toolbar.step !== FIRST_STEP &&
                            <button
                                className={style["toolbar__step-btn"]}
                                onClick={this.prevStep}
                            >
                                Предыдущий шаг
                            </button>
                        }
                        { this.props.toolbar.step !== LAST_STEP &&
                            <button
                                onClick={this.nextStep}
                            >
                                Следующий шаг
                            </button>
                        }
                    </div>
                }
            </div>
        );
    }
}

const mapStateToProps = ({ toolbar }) => ({ toolbar })

const mapDispatchToProps = {
    setVariables,
    drawEllipticParaboloid,
    drawLevelSurface,
    nextStep,
    prevStep,
    drawProjection
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
