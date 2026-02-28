const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api'

export class ApiClient {
  private token: string | null = null

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`
      } else {
        document.cookie = 'token=; path=/; max-age=0'
      }
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      const cookies = document.cookie.split(';')
      const tokenCookie = cookies.find((c) => c.trim().startsWith('token='))
      if (tokenCookie) {
        return tokenCookie.split('=')[1]
      }
    }
    return this.token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Clerk handles authentication via middleware
    // No need to manually add tokens
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Auth - Clerk handles authentication, these are kept for backward compatibility
  async login(email: string, password: string) {
    // Clerk handles login via SignIn component
    throw new Error('Use Clerk SignIn component for authentication')
  }

  async register(userData: { email: string; password: string; name: string; phone?: string; role?: string }) {
    // Clerk handles registration via SignUp component
    throw new Error('Use Clerk SignUp component for registration')
  }

  logout() {
    // Clerk handles logout via useAuth hook
    this.setToken(null)
  }

  // Products
  async getProducts(params?: { categoryId?: string; search?: string; lowStock?: boolean; page?: number; limit?: number }) {
    const query = new URLSearchParams()
    if (params?.categoryId) query.set('categoryId', params.categoryId)
    if (params?.search) query.set('search', params.search)
    if (params?.lowStock) query.set('lowStock', 'true')
    if (params?.page) query.set('page', params.page.toString())
    if (params?.limit) query.set('limit', params.limit.toString())
    return this.request(`/products?${query.toString()}`)
  }

  async getProduct(id: string) {
    return this.request(`/products/${id}`)
  }

  async createProduct(productData: any) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    })
  }

  async updateProduct(id: string, productData: any) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    })
  }

  async deleteProduct(id: string) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    })
  }

  async scanProduct(barcode?: string, qrCode?: string, imei?: string) {
    const query = new URLSearchParams()
    if (barcode) query.set('barcode', barcode)
    if (qrCode) query.set('qrCode', qrCode)
    if (imei) query.set('imei', imei)
    return this.request(`/products/scan?${query.toString()}`)
  }

  // Categories
  async getCategories() {
    return this.request('/categories')
  }

  async createCategory(categoryData: any) {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    })
  }

  // Sales
  async getSales(params?: { startDate?: string; endDate?: string; customerId?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams()
    if (params?.startDate) query.set('startDate', params.startDate)
    if (params?.endDate) query.set('endDate', params.endDate)
    if (params?.customerId) query.set('customerId', params.customerId)
    if (params?.page) query.set('page', params.page.toString())
    if (params?.limit) query.set('limit', params.limit.toString())
    return this.request(`/sales?${query.toString()}`)
  }

  async createSale(saleData: any) {
    return this.request('/sales', {
      method: 'POST',
      body: JSON.stringify(saleData),
    })
  }

  // Customers
  async getCustomers(params?: { search?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams()
    if (params?.search) query.set('search', params.search)
    if (params?.page) query.set('page', params.page.toString())
    if (params?.limit) query.set('limit', params.limit.toString())
    return this.request(`/customers?${query.toString()}`)
  }

  async createCustomer(customerData: any) {
    return this.request('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    })
  }

  // Suppliers
  async getSuppliers(params?: { search?: string }) {
    const query = new URLSearchParams()
    if (params?.search) query.set('search', params.search)
    return this.request(`/suppliers?${query.toString()}`)
  }

  async createSupplier(supplierData: any) {
    return this.request('/suppliers', {
      method: 'POST',
      body: JSON.stringify(supplierData),
    })
  }

  // Purchases
  async getPurchases(params?: { startDate?: string; endDate?: string; supplierId?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams()
    if (params?.startDate) query.set('startDate', params.startDate)
    if (params?.endDate) query.set('endDate', params.endDate)
    if (params?.supplierId) query.set('supplierId', params.supplierId)
    if (params?.page) query.set('page', params.page.toString())
    if (params?.limit) query.set('limit', params.limit.toString())
    return this.request(`/purchases?${query.toString()}`)
  }

  async createPurchase(purchaseData: any) {
    return this.request('/purchases', {
      method: 'POST',
      body: JSON.stringify(purchaseData),
    })
  }

  // Services
  async getServices(params?: { status?: string; customerId?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams()
    if (params?.status) query.set('status', params.status)
    if (params?.customerId) query.set('customerId', params.customerId)
    if (params?.page) query.set('page', params.page.toString())
    if (params?.limit) query.set('limit', params.limit.toString())
    return this.request(`/services?${query.toString()}`)
  }

  async createService(serviceData: any) {
    return this.request('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    })
  }

  async updateService(id: string, serviceData: any) {
    return this.request(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
    })
  }

  // Reports
  async getSalesReport(params?: { startDate?: string; endDate?: string; groupBy?: string }) {
    const query = new URLSearchParams()
    if (params?.startDate) query.set('startDate', params.startDate)
    if (params?.endDate) query.set('endDate', params.endDate)
    if (params?.groupBy) query.set('groupBy', params.groupBy)
    return this.request(`/reports/sales?${query.toString()}`)
  }

  async getStockReport(params?: { lowStock?: boolean; categoryId?: string }) {
    const query = new URLSearchParams()
    if (params?.lowStock) query.set('lowStock', 'true')
    if (params?.categoryId) query.set('categoryId', params.categoryId)
    return this.request(`/reports/stock?${query.toString()}`)
  }

  // Invoices
  async getInvoice(id: string) {
    return this.request(`/invoices/${id}`)
  }
}

export const apiClient = new ApiClient()
