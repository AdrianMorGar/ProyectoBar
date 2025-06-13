import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchDishes, fetchTypes, toggleDishAvailability, toggleDishDisponibility } from '../../../api';
import { Link } from 'react-router-dom';

interface Dish {
  id: number;
  nombrePlato: string;
  descripcion: string;
  precio: number;
  categoria: string;
  disponible: boolean; 
  habilitado: boolean;
  imagen: string;
  tipoId: number;
  groupKey?: string;
}

interface Type {
  id: number;
  nombreTipo: string;
}

interface ConsolidatedDishItem {
  groupKey: string;
  nombrePlato: string;
  descripcion: string;
  imagen: string;
  tipoId: number;
  variations: Dish[];
  isBebida: boolean;
}

interface ProcessedGroup {
  type: Type;
  consolidatedDishes: ConsolidatedDishItem[];
}

const DishList: React.FC = () => {
  const [allDishes, setAllDishes] = useState<Dish[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedAvailability, setExpandedAvailability] = useState<Record<string, boolean>>({});
  const [expandedDelete, setExpandedDelete] = useState<Record<string, boolean>>({});

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const dishesData: Dish[] = await fetchDishes();
      const typesData: Type[] = await fetchTypes();
      const enabledDishes = dishesData.filter(dish => dish.habilitado);
      setAllDishes(enabledDishes);
      setTypes(typesData);
    } catch (error) {
      alert('Hubo un error al cargar los datos.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const executeToggleAvailability = async (dishIdToToggle: number) => {
    try {
      await toggleDishDisponibility(dishIdToToggle);
      setAllDishes(prevDishes =>
        prevDishes.map(dish =>
          dish.id === dishIdToToggle
            ? { ...dish, disponible: !dish.disponible }
            : dish
        )
      );
    } catch (error) {
      alert('Hubo un error al alternar la disponibilidad del plato.');
    }
  };

  const executeDeleteAction = async (dishIdToDelete: number) => {
    try {
      await toggleDishAvailability(dishIdToDelete);
      setAllDishes(prevDishes =>
        prevDishes.map(dish =>
          dish.id === dishIdToDelete
            ? { ...dish, habilitado: false }
            : dish
        ).filter(dish => dish.habilitado)
      );
    } catch (error) {
      alert('Hubo un error al deshabilitar el plato.');
    }
  };

  const toggleAvailabilityActions = (groupKey: string) => {
    setExpandedAvailability(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));
    setExpandedDelete(prev => ({ ...prev, [groupKey]: false }));
  };

  const toggleDeleteActions = (groupKey: string) => {
    setExpandedDelete(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));
    setExpandedAvailability(prev => ({ ...prev, [groupKey]: false }));
  };

  const handleDeleteAllVariations = async (variations: Dish[]) => {
    const firstVariationName = variations.length > 0 ? variations[0].nombrePlato : "este plato";
    if (window.confirm(`¿Estás seguro de que deseas deshabilitar todas las versiones de "${firstVariationName}"?`)) {
      try {
        await Promise.all(variations.map(v => toggleDishAvailability(v.id)));
        const idsToDisable = new Set(variations.map(v => v.id));
        setAllDishes(prevDishes =>
          prevDishes.map(dish =>
            idsToDisable.has(dish.id)
              ? { ...dish, habilitado: false }
              : dish
          ).filter(dish => dish.habilitado)
        );
        setExpandedDelete({});
      } catch (error) {
        alert('Hubo un error al deshabilitar todas las versiones del plato.');
      }
    }
  };

  const filteredTypes = useMemo(() => {
    return types.filter((type) => allDishes.some((dish) => dish.tipoId === type.id && dish.habilitado));
  }, [allDishes, types]);

  const toggleTypeFilter = (typeId: number) => {
    setSelectedTypeId((prevId) => (prevId === typeId ? null : typeId));
  };

  const currentVisibleDishes = useMemo(() => {
    const activeDishes = allDishes.filter(dish => dish.habilitado);
    if (selectedTypeId === null) return activeDishes;
    return activeDishes.filter((dish) => dish.tipoId === selectedTypeId);
  }, [allDishes, selectedTypeId]);

  const processedGroupedDishes: ProcessedGroup[] = useMemo(() => {
    const groupedByType: Record<number, Dish[]> = {};
    currentVisibleDishes.forEach(dish => {
      if (!groupedByType[dish.tipoId]) {
        groupedByType[dish.tipoId] = [];
      }
      groupedByType[dish.tipoId].push(dish);
    });

    return types
      .map(type => {
        const dishesOfType = groupedByType[type.id] || [];
        if (dishesOfType.length === 0) return null;

        const dishesByName: Record<string, Dish[]> = {};
        dishesOfType.forEach(dish => {
          if (!dishesByName[dish.nombrePlato]) {
            dishesByName[dish.nombrePlato] = [];
          }
          dishesByName[dish.nombrePlato].push(dish);
        });

        const consolidatedDishesResult: ConsolidatedDishItem[] = Object.values(dishesByName).map((variations): ConsolidatedDishItem | null => {
          if (variations.length === 0) return null;
          const firstVariation = variations[0];
          const isBebida = variations.some(v => v.categoria === 'BEBIDA');

          const orderMap: { [key: string]: number } = { 'TAPA': 1, 'MEDIA': 2, 'PLATO': 3, 'BEBIDA': 4 };
          variations.sort((a, b) => (orderMap[a.categoria] || 99) - (orderMap[b.categoria] || 99));

          return {
            groupKey: `${firstVariation.nombrePlato}_${type.id}`.replace(/\s+/g, '_'),
            nombrePlato: firstVariation.nombrePlato,
            descripcion: firstVariation.descripcion,
            imagen: firstVariation.imagen,
            tipoId: firstVariation.tipoId,
            variations: variations,
            isBebida: isBebida,
          };
        }).filter(Boolean) as ConsolidatedDishItem[];

        if (consolidatedDishesResult.length === 0) return null;

        return {
          type,
          consolidatedDishes: consolidatedDishesResult,
        };
      })
      .filter(Boolean) as ProcessedGroup[];
  }, [currentVisibleDishes, types]);


  if (isLoading && !allDishes.length) {
    return <p className="loading-message">Cargando platos...</p>;
  }

  return (
    <div className="dish-list-container owner-dish-list">
      <div className="dish-list-header">
        <h2 className="page-title-owner">Gestión de la Carta</h2>
        <div className="add-dish-button-wrapper">
          <Link to="nuevo" className="btn btn-success">
            Añadir Plato
          </Link>
        </div>
      </div>

      {filteredTypes.length > 0 && (
        <div className="type-filter-buttons">
          <button
            className={`btn ${selectedTypeId === null ? 'active' : ''}`}
            onClick={() => setSelectedTypeId(null)}
          >
            Todos
          </button>
          {filteredTypes.map((type) => (
            <button
              key={type.id}
              className={`btn ${selectedTypeId === type.id ? 'active' : ''}`}
              onClick={() => toggleTypeFilter(type.id)}
            >
              {type.nombreTipo}
            </button>
          ))}
        </div>
      )}

      {processedGroupedDishes.length > 0 ? (
        processedGroupedDishes.map(({ type, consolidatedDishes }) => (
          <div key={type.id} className="dish-type-section">
            <h3 className="dish-type-title">{type.nombreTipo}</h3>
            <div className="owner-dish-grid">
              {consolidatedDishes.map((cDish) => {
                const isVisuallyUnavailable = cDish.variations.every(v => !v.disponible);


                return (
                  <div
                    key={cDish.groupKey}
                    className={`owner-dish-card ${isVisuallyUnavailable ? 'dish-fully-unavailable' : ''}`}
                  >
                    <img
                      src={cDish.imagen}
                      alt={cDish.nombrePlato}
                      className="dish-image-owner"
                    />
                    <div className="dish-details-owner">
                      <h4 className="dish-name-owner">{cDish.nombrePlato}</h4>
                      <p className="dish-description-owner">{cDish.descripcion}</p>
                      <div className="dish-variations">
                        {cDish.isBebida && cDish.variations.length > 0 ? (
                          <p className={`dish-price-owner ${!cDish.variations[0].disponible ? 'variation-item-unavailable' : ''}`}>
                            {`${cDish.variations[0].precio.toFixed(2)}€`}
                          </p>
                        ) : (
                          cDish.variations.map(v => (
                            <p
                              key={v.id}
                              className={`dish-price-owner ${!v.disponible ? 'variation-item-unavailable' : ''}`}
                            >
                              {`${v.categoria}: ${v.precio.toFixed(2)}€`}
                            </p>
                          ))
                        )}
                      </div>
                    </div>
                    <div className="dish-actions-owner">
                      <div className="main-action-buttons">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            cDish.isBebida ? executeToggleAvailability(cDish.variations[0].id) : toggleAvailabilityActions(cDish.groupKey);
                          }}
                          className={`btn btn-sm toggle-availability-btn-prompt ${cDish.isBebida
                              ? (cDish.variations[0]?.disponible ? 'available' : 'not-available')
                              : (cDish.variations.some(v => v.disponible) ? 'available' : 'not-available')
                            }`}
                        >
                          {cDish.isBebida
                            ? (cDish.variations[0]?.disponible ? ' Disponibles ' : 'No Disponible')
                            : (cDish.variations.some(v => v.disponible) ? ' Disponibles ' : 'No Disponible')
                          }
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            cDish.isBebida ? executeDeleteAction(cDish.variations[0].id) : toggleDeleteActions(cDish.groupKey)
                          }}
                          className="btn btn-sm btn-danger delete-btn-prompt"
                        >
                          Eliminar
                        </button>

                        <Link
                          to={`editar/${cDish.variations[0].id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="btn btn-sm btn-info update-btn"
                        >
                          Actualizar
                        </Link>
                      </div>

                      {expandedAvailability[cDish.groupKey] && !cDish.isBebida && (
                        <div className="availability-actions">
                          {cDish.variations.map(v => (
                            <button
                              key={v.id}
                              onClick={(e) => { e.stopPropagation(); executeToggleAvailability(v.id); }}
                              className={`btn btn-sm ${v.disponible ? 'btn-success' : 'btn-warning'}`}
                            >
                              {v.categoria}: {v.disponible ? 'Marcar No Disp.' : 'Marcar Disp.'}
                            </button>
                          ))}
                        </div>
                      )}

                      {expandedDelete[cDish.groupKey] && !cDish.isBebida && (
                        <div className="delete-confirm-actions">
                          {cDish.variations.map(v => (
                            <button
                              key={v.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`¿Estás seguro de que deseas deshabilitar ${cDish.nombrePlato} (${v.categoria})?`)) {
                                  executeDeleteAction(v.id);
                                }
                              }}
                              className="btn btn-sm btn-danger"
                            >
                              Eliminar {v.categoria}
                            </button>
                          ))}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteAllVariations(cDish.variations); }}
                            className="btn btn-sm btn-danger"
                          >
                            Todos
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      ) : (
        <p className="no-dishes-message">
          {selectedTypeId === null ? "No hay platos habilitados en el sistema." : "No hay platos habilitados para el tipo seleccionado."}
        </p>
      )}
    </div>
  );
};

export default DishList;