import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import DefaultLayout from '../../components/DefaultLayout/DefaultLayout';
import Filters from '../../components/Filters/Filters';
import Loader from '../../components/Loader/Loader';
import Product from '../../components/Product/Product';
import { useAppSelector } from '../../hooks/redux';
import { setActiveBrand, setActiveSort, setMaxPrice, setSearch } from '../../store/slices/itemsSlice';
import { fetchBrands, fetchItems } from '../../store/thunks/items';
import { sortOptions } from '../../utils/data';
import s from "./Products.module.scss"




const Products = () => {
    const { items, itemsLoading, activeBrand, maxPrice, activeSort } = useAppSelector(state => state.items)

    const dispatch = useDispatch()
    const params = useParams() as { categ: string }

    const [searchParams] = useSearchParams()
    const searchQuery = searchParams.get("search")!

    useEffect(() => {
        if (!maxPrice) {
            dispatch(fetchItems({
                category: params.categ,
                brand: activeBrand!,
                activeSort: activeSort!,
                search: searchQuery
            }))
        } else {
            dispatch(fetchItems({
                category: params.categ,
                brand: activeBrand!,
                activeSort: activeSort!,
                search: searchQuery,
                max: maxPrice
            }))
        }
    }, [activeBrand, dispatch, maxPrice, activeSort, searchQuery])


    useEffect(() => {
        dispatch(fetchBrands())
        dispatch(setMaxPrice(0))
        dispatch(setActiveSort(null))
        dispatch(setActiveBrand(null))
        dispatch(setSearch(null))
    }, [dispatch])


    const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setActiveSort(e.target.value))
    }

    return (
        <DefaultLayout>
            <div className={s.header}>
                <h1 className={s.titleFor}>Results<span></span></h1>
                <div className={s.sort}>
                    <label htmlFor="sort">Sort by: </label>
                    <select id="sort" onChange={handleSort}>
                        <option disabled>Choose sort</option>
                        {sortOptions.map(s => <option value={s.value} key={s.value}>
                            {s.title}
                        </option>)}
                    </select>
                </div>
            </div>


            <section className={s.section}>
                <Filters />


                {itemsLoading
                    ? <div className={s.itemsLoader}><Loader /></div>
                    : <ul className={s.list}>
                        {items.length > 0
                            ? items.map(i => <Product item={i} key={i._id} />)
                            : <h2 className={s.notFound}>
                                Items not found
                            </h2>}
                    </ul>}

            </section>
        </DefaultLayout>
    );
};

export default Products;