学习笔记

四则运算:

	TokenNumber:
	•1 2 3 4 5 6 7 8 9 0的组合
	•Operator:+、-、*、/之一
	•Whitespace:<SP>
	•LineTerminator:<LR><CR>

LL语法分析:

	<Expression>::=
		<AdditiveExpression><EOF>

	<AdditiveExpression> ::=
		<MultiplicativeExpression>
		|<AdditiveExpression><+><MultiplicativeExpression>
		|<AdditiveExpression><-><MultiplicativeExpression>

	<MultiplicativeExpression> ::=
		<Number>
		|<MultiplicativeExpression><*><Number>
		|<MultiplicativeExpression></><Number>


	<AdditiveExpression> ::=
		<Number>
		|<MultiplicativeExpression><*><Number>
		|<MultiplicativeExpression></><Number>	
		|<AdditiveExpression><*><MultiplicativeExpression>
		|<AdditiveExpression></><MultiplicativeExpression>