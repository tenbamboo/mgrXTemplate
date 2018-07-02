import _cloneDeep from 'lodash/cloneDeep'
import _pick from 'lodash/pick'
import _find from 'lodash/find'
import _findIndex from 'lodash/findIndex'
import _map from 'lodash/map'
import _orderBy from 'lodash/orderBy'
import _filter from 'lodash/filter'
import _debounce from 'lodash/debounce'

export default {
  cloneDeep: _cloneDeep,
  // size: _.size,
  pick: _pick,
  // isEmpty: _.isEmpty,
  find: _find,
  findIndex: _findIndex,
  map: _map,
  filter: _filter,
  orderBy: _orderBy,
  debounce: _debounce
}
