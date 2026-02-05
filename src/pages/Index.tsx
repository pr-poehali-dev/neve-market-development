import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Icon from '@/components/ui/icon'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { AuthModal } from '@/components/AuthModal'
import { CartSheet } from '@/components/CartSheet'
import { useToast } from '@/hooks/use-toast'

const Index = () => {
  const [activeTab, setActiveTab] = useState('catalog')
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    const userEmail = localStorage.getItem('userEmail')
    if (userId && userEmail) {
      setUser({ id: userId, email: userEmail })
    }
  }, [])

  const handleAddToCart = async (productId: number) => {
    if (!user) {
      toast({
        title: 'Требуется авторизация',
        description: 'Войдите, чтобы добавить товар в корзину',
        variant: 'destructive',
      })
      setAuthModalOpen(true)
      return
    }

    try {
      const response = await fetch('https://functions.poehali.dev/71ed6a81-59be-4417-9788-a26c2747e5c5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          product_id: productId,
          quantity: 1,
        }),
      })

      if (response.ok) {
        toast({
          title: 'Добавлено в корзину',
          description: 'Товар успешно добавлен',
        })
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить товар',
        variant: 'destructive',
      })
    }
  }

  const categories = [
    { icon: 'Send', name: 'Telegram каналы', count: 156 },
    { icon: 'Gamepad2', name: 'Игровые аккаунты', count: 89 },
    { icon: 'Star', name: 'Telegram Star', count: 234 },
    { icon: 'Crown', name: 'Telegram Premium', count: 67 },
  ]

  const products = [
    {
      id: 1,
      title: 'Канал о маркетинге | 25k подписчиков',
      category: 'Telegram каналы',
      price: 125000,
      subscribers: '25 000',
      engagement: '12%',
      image: 'https://cdn.poehali.dev/projects/5d528024-11ab-4b3d-8bec-efcf2eae5a94/files/381d4752-4e2e-46d3-b18c-baba7198be70.jpg'
    },
    {
      id: 2,
      title: 'CS:GO аккаунт | Global Elite',
      category: 'Игровые аккаунты',
      price: 8500,
      hours: '2500 часов',
      skins: '15 скинов',
      image: 'https://cdn.poehali.dev/projects/5d528024-11ab-4b3d-8bec-efcf2eae5a94/files/381d4752-4e2e-46d3-b18c-baba7198be70.jpg'
    },
    {
      id: 3,
      title: 'Telegram Premium | 12 месяцев',
      category: 'Telegram Premium',
      price: 2400,
      duration: '12 месяцев',
      status: 'Моментально',
      image: 'https://cdn.poehali.dev/projects/5d528024-11ab-4b3d-8bec-efcf2eae5a94/files/381d4752-4e2e-46d3-b18c-baba7198be70.jpg'
    },
    {
      id: 4,
      title: '1000 Telegram Stars',
      category: 'Telegram Star',
      price: 1200,
      amount: '1000 Stars',
      delivery: 'Моментально',
      image: 'https://cdn.poehali.dev/projects/5d528024-11ab-4b3d-8bec-efcf2eae5a94/files/381d4752-4e2e-46d3-b18c-baba7198be70.jpg'
    },
    {
      id: 5,
      title: 'Канал о криптовалюте | 50k подписчиков',
      category: 'Telegram каналы',
      price: 350000,
      subscribers: '50 000',
      engagement: '15%',
      image: 'https://cdn.poehali.dev/projects/5d528024-11ab-4b3d-8bec-efcf2eae5a94/files/381d4752-4e2e-46d3-b18c-baba7198be70.jpg'
    },
    {
      id: 6,
      title: 'Dota 2 аккаунт | Immortal',
      category: 'Игровые аккаунты',
      price: 15000,
      hours: '3000 часов',
      mmr: '7500 MMR',
      image: 'https://cdn.poehali.dev/projects/5d528024-11ab-4b3d-8bec-efcf2eae5a94/files/381d4752-4e2e-46d3-b18c-baba7198be70.jpg'
    },
  ]

  const faqItems = [
    {
      question: 'Как происходит покупка товара?',
      answer: 'После оплаты вы получаете доступ к чату с продавцом, где он передает вам товар. Все данные защищены, а сделка проходит через нашу безопасную систему.'
    },
    {
      question: 'Как я могу продавать товары?',
      answer: 'Зарегистрируйтесь, перейдите в раздел "Мой магазин" и добавьте свои товары с описанием, ценой и категорией. После модерации товар появится в каталоге.'
    },
    {
      question: 'Какие способы оплаты доступны?',
      answer: 'Мы поддерживаем банковские карты, электронные кошельки, криптовалюту и другие популярные платежные системы для максимального удобства.'
    },
    {
      question: 'Как вывести заработанные деньги?',
      answer: 'В разделе "Кошелек" выберите "Вывод средств", укажите сумму и способ получения (карта, кошелек). Выплаты обрабатываются в течение 1-3 рабочих дней.'
    },
    {
      question: 'Есть ли гарантия безопасности сделок?',
      answer: 'Да! Все платежи проходят через защищенную систему, деньги держатся на счете до подтверждения получения товара покупателем. Мы гарантируем безопасность.'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img 
              src="https://cdn.poehali.dev/projects/5d528024-11ab-4b3d-8bec-efcf2eae5a94/files/381d4752-4e2e-46d3-b18c-baba7198be70.jpg" 
              alt="NeveMarket" 
              className="h-10 w-10 rounded-lg"
            />
            <span className="text-xl font-bold text-primary">NeveMarket</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Button variant="ghost" className="gap-2">
              <Icon name="Home" size={18} />
              Главная
            </Button>
            <Button variant="ghost" className="gap-2">
              <Icon name="Grid3x3" size={18} />
              Каталог
            </Button>
            <Button variant="ghost" className="gap-2">
              <Icon name="ShoppingBag" size={18} />
              Мои покупки
            </Button>
            <Button variant="ghost" className="gap-2" onClick={() => window.location.href = '/my-shop'}>
              <Icon name="Store" size={18} />
              Мой магазин
            </Button>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Icon name="MessageSquare" size={20} />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive"></span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => user ? setCartOpen(true) : setAuthModalOpen(true)}>
              <Icon name="ShoppingCart" size={20} />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="Wallet" size={20} />
            </Button>
            {user ? (
              <Button variant="default" className="gap-2">
                <Icon name="User" size={18} />
                {user.email}
              </Button>
            ) : (
              <Button variant="default" className="gap-2" onClick={() => setAuthModalOpen(true)}>
                <Icon name="User" size={18} />
                Войти
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12 rounded-2xl bg-gradient-to-br from-primary to-secondary p-12 text-center text-white">
          <h1 className="mb-4 text-5xl font-bold">NeveMarket</h1>
          <p className="mb-6 text-xl opacity-90">
            Маркетплейс цифровых активов Telegram
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" className="gap-2 bg-white text-primary hover:bg-white/90">
              <Icon name="Search" size={20} />
              Найти товар
            </Button>
            <Button size="lg" variant="outline" className="gap-2 border-white text-white hover:bg-white/10" onClick={() => window.location.href = '/my-shop'}>
              <Icon name="Plus" size={20} />
              Продать товар
            </Button>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold">Категории товаров</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Card 
                key={category.name}
                className="cursor-pointer p-6 transition-all hover:scale-105 hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-primary/10 p-3">
                    <Icon name={category.icon} size={28} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.count} товаров</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
          <TabsList className="mb-6 grid w-full grid-cols-3 lg:w-[600px]">
            <TabsTrigger value="catalog">Популярные</TabsTrigger>
            <TabsTrigger value="new">Новые</TabsTrigger>
            <TabsTrigger value="premium">Премиум</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden transition-all hover:shadow-xl">
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="h-48 w-full object-cover"
                    />
                    <Badge className="absolute top-3 right-3">
                      {product.category}
                    </Badge>
                  </div>
                  <div className="p-6">
                    <h3 className="mb-3 text-lg font-semibold">{product.title}</h3>
                    <div className="mb-4 flex flex-wrap gap-2">
                      {'subscribers' in product && (
                        <Badge variant="outline">
                          <Icon name="Users" size={14} className="mr-1" />
                          {product.subscribers}
                        </Badge>
                      )}
                      {'engagement' in product && (
                        <Badge variant="outline">
                          <Icon name="TrendingUp" size={14} className="mr-1" />
                          {product.engagement}
                        </Badge>
                      )}
                      {'hours' in product && (
                        <Badge variant="outline">
                          <Icon name="Clock" size={14} className="mr-1" />
                          {product.hours}
                        </Badge>
                      )}
                      {'duration' in product && (
                        <Badge variant="outline">
                          <Icon name="Calendar" size={14} className="mr-1" />
                          {product.duration}
                        </Badge>
                      )}
                      {'amount' in product && (
                        <Badge variant="outline">
                          <Icon name="Star" size={14} className="mr-1" />
                          {product.amount}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-primary">
                          {product.price.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                      <Button className="gap-2" onClick={() => handleAddToCart(product.id)}>
                        <Icon name="ShoppingCart" size={18} />
                        Купить
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <section className="mb-12">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Icon name="Shield" size={32} className="text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Безопасные сделки</h3>
              <p className="text-muted-foreground">
                Все платежи защищены, деньги держатся до подтверждения
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Icon name="MessageSquare" size={32} className="text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Чат поддержки 24/7</h3>
              <p className="text-muted-foreground">
                Всегда на связи для решения любых вопросов
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Icon name="Zap" size={32} className="text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Моментальная доставка</h3>
              <p className="text-muted-foreground">
                Получайте товары сразу после оплаты
              </p>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold">Часто задаваемые вопросы</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-semibold">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="mb-12 rounded-2xl bg-primary p-12 text-center text-white">
          <h2 className="mb-4 text-3xl font-bold">Начните продавать прямо сейчас</h2>
          <p className="mb-6 text-lg opacity-90">
            Зарегистрируйтесь и начните зарабатывать на продаже цифровых активов
          </p>
          <Button size="lg" variant="secondary" className="gap-2 bg-white text-primary hover:bg-white/90">
            <Icon name="UserPlus" size={20} />
            Создать аккаунт
          </Button>
        </section>
      </main>

      <footer className="border-t bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <img 
                  src="https://cdn.poehali.dev/projects/5d528024-11ab-4b3d-8bec-efcf2eae5a94/files/381d4752-4e2e-46d3-b18c-baba7198be70.jpg" 
                  alt="NeveMarket" 
                  className="h-10 w-10 rounded-lg"
                />
                <span className="text-xl font-bold text-primary">NeveMarket</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Маркетплейс цифровых активов Telegram
              </p>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">Покупателям</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Каталог товаров</a></li>
                <li><a href="#" className="hover:text-primary">Мои покупки</a></li>
                <li><a href="#" className="hover:text-primary">Корзина</a></li>
                <li><a href="#" className="hover:text-primary">Кошелек</a></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">Продавцам</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Мой магазин</a></li>
                <li><a href="#" className="hover:text-primary">Добавить товар</a></li>
                <li><a href="#" className="hover:text-primary">Вывод средств</a></li>
                <li><a href="#" className="hover:text-primary">Статистика</a></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">Поддержка</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Чат поддержки</a></li>
                <li><a href="#" className="hover:text-primary">FAQ</a></li>
                <li><a href="#" className="hover:text-primary">Правила</a></li>
                <li><a href="#" className="hover:text-primary">Контакты</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            © 2024 NeveMarket. Все права защищены.
          </div>
        </div>
      </footer>

      <AuthModal 
        open={authModalOpen} 
        onOpenChange={setAuthModalOpen}
        onAuthSuccess={(userData) => setUser(userData)}
      />
      
      <CartSheet 
        open={cartOpen}
        onOpenChange={setCartOpen}
        userId={user?.id || null}
      />
    </div>
  )
}

export default Index