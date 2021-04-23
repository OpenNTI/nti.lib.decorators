declare module '@nti/lib-decorators' {
	function mixin<T, A>(a: A): (x: T) => T & ReturnType<A>;
	function mixin<T, A, B>(
		a: A,
		b: B
	): (x: T) => T & ReturnType<A> & ReturnType<B>;
	function mixin<T, A, B, C>(
		a: A,
		b: B,
		c: C
	): (x: T) => T & ReturnType<A> & ReturnType<B> & ReturnType<C>;
	function mixin<T, A, B, C, D>(
		a: A,
		b: B,
		c: C,
		d: D
	): (
		x: T
	) => T & ReturnType<A> & ReturnType<B> & ReturnType<C> & ReturnType<D>;
	function mixin<T, A, B, C, D, E>(
		a: A,
		b: B,
		c: C,
		d: D,
		e: E
	): (
		x: T
	) => T &
		ReturnType<A> &
		ReturnType<B> &
		ReturnType<C> &
		ReturnType<D> &
		ReturnType<E>;
	function mixin<T, A, B, C, D, E, F>(
		a: A,
		b: B,
		c: C,
		d: D,
		e: E,
		f: F
	): (
		x: T
	) => T &
		ReturnType<A> &
		ReturnType<B> &
		ReturnType<C> &
		ReturnType<D> &
		ReturnType<E> &
		ReturnType<F>;
	function mixin<T, A, B, C, D, E, F, G>(
		a: A,
		b: B,
		c: C,
		d: D,
		e: E,
		f: F,
		g: G
	): (
		x: T
	) => T &
		ReturnType<A> &
		ReturnType<B> &
		ReturnType<C> &
		ReturnType<D> &
		ReturnType<E> &
		ReturnType<F> &
		ReturnType<G>;
	function mixin<T, A, B, C, D, E, F, G, H>(
		a: A,
		b: B,
		c: C,
		d: D,
		e: E,
		f: F,
		g: G,
		h: H
	): (
		x: T
	) => T &
		ReturnType<A> &
		ReturnType<B> &
		ReturnType<C> &
		ReturnType<D> &
		ReturnType<E> &
		ReturnType<F> &
		ReturnType<G> &
		ReturnType<H>;
}
