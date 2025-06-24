import kivy
from kivy.app import App
from kivy.uix.screenmanager import ScreenManager, Screen
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.floatlayout import FloatLayout
from kivy.uix.gridlayout import GridLayout
from kivy.uix.button import Button
from kivy.uix.label import Label
from kivy.uix.widget import Widget
from kivy.uix.textinput import TextInput
from kivy.uix.image import Image
from kivy.properties import StringProperty, ObjectProperty, NumericProperty, ListProperty
from kivy.lang import Builder
from kivy.metrics import dp
from kivy.uix.popup import Popup
from kivy.animation import Animation
from kivy.clock import Clock
import random
from kivy.utils import get_color_from_hex
from kivy.graphics import Color, RoundedRectangle, Line, Rectangle
from kivy.uix.behaviors import ButtonBehavior

kivy.require('2.0.0')

Builder.load_string("""
#:import get_color_from_hex kivy.utils.get_color_from_hex

<RecapEntry@BoxLayout>:
    recap_text: ''
    status_color: [0, 0, 0, 1] # Cor padrão preta
    size_hint_y: None
    # AQUI ESTÁ A CORREÇÃO PRINCIPAL:
    # A altura total é a altura do texto do label + o padding vertical (dp(5) de cima + dp(5) de baixo)
    height: recap_label.texture_size[1] + dp(10)
    padding: (dp(10), dp(5))

    canvas.after:
        Color:
            rgba: get_color_from_hex("#DDDDDD")
        Line:
            points: [self.x, self.y, self.x + self.width, self.y]
            width: dp(1)

    # Barra de cor lateral
    Widget:
        size_hint_x: None
        width: dp(5)
        canvas.before:
            Color:
                rgba: root.status_color
            Rectangle:
                pos: self.pos
                size: self.size
    
    # Espaçador
    Widget:
        size_hint_x: None
        width: dp(10)

    # Rótulo com o texto
    Label:
        id: recap_label # <-- ID adicionado para podermos referenciar a altura
        text: root.recap_text
        markup: True
        font_size: '16sp'
        color: app.colors['text_on_light']
        halign: 'left'
        valign: 'middle'
        text_size: self.width, None

<SolidButton@Button>:
    background_color: 0, 0, 0, 0
    color: app.colors['text_on_accent']
    font_size: '22sp'
    bold: True
    canvas.before:
        Color:
            rgba: get_color_from_hex("#1E2A6B") if self.state == 'down' else app.colors['accent_main']
        RoundedRectangle:
            size: self.size
            pos: self.pos
            radius: [dp(25)]

<HollowButton@Button>:
    background_color: 0, 0, 0, 0
    color: app.colors['text_on_dark']
    font_size: '22sp'
    bold: True
    canvas.before:
        Color:
            rgba: app.colors['accent_main'] if self.state == 'down' else app.colors['text_on_dark']
        Line:
            width: dp(1.5)
            rounded_rectangle: (self.x, self.y, self.width, self.height, dp(25))

<PopupButton@Button>:
    background_color: 0, 0, 0, 0
    color: app.colors['text_on_accent']  # 1. Cor da fonte alterada para branco
    font_size: '18sp'
    bold: True
    canvas.before:
        # 2. Canvas alterado para desenhar um fundo azul sólido
        Color:
            # Lógica para escurecer o botão quando pressionado
            rgba: get_color_from_hex("#1E2A6B") if self.state == 'down' else app.colors['accent_main']
        RoundedRectangle:
            size: self.size
            pos: self.pos
            radius: [dp(15)]
                    
<PopupSeparator@Widget>:
    canvas:
        Color:
            rgba: app.colors['text_on_light']  # Cor preta
        Rectangle:
            pos: self.pos
            size: self.size
                    
<OkIconButton>:
    size_hint: None, None
    size: dp(55), dp(55)
    canvas.before:
        Color:
            rgba: get_color_from_hex("#1E2A6B") if self.state == 'down' else app.colors['accent_main']
        RoundedRectangle:
            size: self.size
            pos: self.pos
            radius: [dp(15)]
    Image:
        source: 'check.png'
        # AQUI ESTÁ A CORREÇÃO: Usamos pos_hint para centralizar
        # dentro do FloatLayout pai.
        pos_hint: {'center_x': 0.5, 'center_y': 0.5}
        size_hint: None, None
        size: dp(30), dp(30)

<ThemedTextInput@TextInput>:
    background_color: 1, 1, 1, 1
    foreground_color: 0, 0, 0, 1
    cursor_color: 0, 0, 0, 1
    hint_text_color: 0.6, 0.6, 0.6, 1
    padding: [dp(12), dp(15), dp(12), dp(15)]
    multiline: False
    font_size: '18sp'
                    
<RecapScreen>:
    BoxLayout:
        orientation: 'vertical'
        padding: dp(30)
        spacing: dp(20)

        Label:
            text: 'Fim de jogo!'
            font_size: '40sp'
            bold: True
            color: app.colors['text_on_light']
            size_hint_y: 0.15

        Label:
            id: final_score_label
            text: 'Pontuação final: 0'
            font_size: '24sp'
            markup: True
            color: app.colors['accent_main']
            size_hint_y: 0.1

        # Área de Rolagem para o Resumo
        ScrollView:
            size_hint_y: 0.6
            do_scroll_x: False
            GridLayout:
                id: recap_list
                cols: 1
                size_hint_y: None
                height: self.minimum_height
                spacing: dp(5)

        # Botão para Voltar ao menu
        SolidButton:
            text: 'Voltar ao menu'
            size_hint_y: 0.1
            on_press: app.root.current = 'menu'

<Screen>:
    canvas.before:
        Color:
            rgba: app.colors['background_main_light']
        Rectangle:
            pos: self.pos
            size: self.size

<MenuScreen>:
    BoxLayout:
        orientation: 'vertical'
        padding: dp(50)
        spacing: dp(20)
        Image:
            source: 'logo.png'
            allow_stretch: True
            keep_ratio: True
            size_hint_y: 0.7
        BoxLayout:
            orientation: 'vertical'
            size_hint_y: 0.3
            spacing: dp(15)
            padding: [dp(20), 0, dp(20), 0]
            SolidButton:
                text: 'Jogar'
                on_press: app.root.current = 'player_config'
            SolidButton:
                text: 'Instruções'
                on_press: app.root.current = 'instructions'

<InstructionsScreen>:
    BoxLayout:
        orientation: 'vertical'
        padding: dp(30)
        spacing: dp(20)
        Label:
            text: 'Instruções'
            font_size: '40sp'
            bold: True
            color: app.colors['text_on_light']
            size_hint_y: 0.2
        Label:
            text: \"\"\"[color=3D405B]Bem-vindo ao Codex!\\n\\nSeu objetivo é adivinhar o termo de tecnologia com o mínimo de dicas. Os temas são: [b][color=2c3c8d]Ano, Coisa, Pessoa[/color][/b] ou [b][color=2c3c8d]Lugar[/color][/b].\\n\\n[b]Pontuação:[/b]\\n1ª Dica: +5 Pontos\\n2ª Dica: +4 Pontos\\n3ª Dica: +3 Pontos\\n4ª Dica: +2 Pontos\\n5ª Dica: +1 Ponto[/color]\"\"\"
            markup: True
            text_size: self.width - dp(40), None
            font_size: '18sp'
            halign: 'center'
            valign: 'top'
            size_hint_y: 0.6
        SolidButton:
            text: 'Voltar ao Menu'
            size_hint_y: 0.1
            on_press: app.root.current = 'menu'

<PlayerConfigScreen>:
    canvas.before:
        Color:
            rgba: app.colors['accent_main']
        Rectangle:
            pos: self.pos
            size: self.size
    BoxLayout:
        orientation: 'vertical'
        padding: [dp(40), dp(30)]
        spacing: dp(20)
        Image:
            source: 'logo_azul.png'
            size_hint_y: 0.4
            allow_stretch: True
            keep_ratio: True
        Widget:
            size_hint_y: 0.1
        BoxLayout:
            orientation: 'vertical'
            size_hint_y: None
            height: self.minimum_height
            spacing: dp(10)
            Label:
                text: 'Digite seu nome:'
                font_size: '18sp'
                color: app.colors['text_on_dark']
                size_hint_y: None
                height: self.texture_size[1]
                text_size: self.width, None
                halign: 'left'
            ThemedTextInput:
                id: player_name_input
                hint_text: 'Seu nome aqui'
                size_hint_y: None
                height: dp(55)
                on_text: app.jogador_nome = self.text
        Widget:
            size_hint_y: 0.2
        HollowButton:
            text: 'Começar Jogo'
            size_hint_y: None
            height: dp(55)
            on_press: root.start_game_validation()

<GameScreen>:
    BoxLayout:
        orientation: 'vertical'
        padding: dp(15)
        spacing: dp(10)
        BoxLayout:
            orientation: 'horizontal'
            size_hint_y: 0.05
            spacing: dp(5)
            Widget:
            Image:
                source: 'jogador.png'
                size_hint_x: None
                width: self.height
            Label:
                id: player_name_label
                text: 'Jogador: '
                font_size: '18sp'
                color: app.colors['text_grey_light_theme']
                size_hint_x: None
                width: self.texture_size[0]
            Widget:
                size_hint_x: None
                width: dp(30)
            Image:
                source: 'pontos.png'
                size_hint_x: None
                width: self.height
            Label:
                id: score_label
                text: 'Pontos: 0'
                font_size: '18sp'
                color: app.colors['text_grey_light_theme']
                size_hint_x: None
                width: self.texture_size[0]
            Widget:
        BoxLayout:
            orientation: 'vertical'
            padding: dp(20)
            size_hint_y: 0.55
            canvas.before:
                Rectangle:
                    source: 'carta.png'
                    pos: self.pos
                    size: self.size
            Label:
                id: theme_label
                text: root.current_card_theme
                font_size: '28sp'
                color: app.colors['text_on_light']
                bold: True
                markup: True
                size_hint_y: 0.3
            ScrollView:
                size_hint_y: 0.7
                do_scroll_x: False
                do_scroll_y: True
                Label:
                    id: dica_label
                    line_height: 1.3
                    text: 'Clique nos números para revelar as dicas!'
                    color: app.colors['text_on_light']
                    font_size: '18sp'
                    halign: 'left'
                    valign: 'top'
                    markup: True
                    padding: (dp(10), dp(10))
                    text_size: self.width, None
                    size_hint_y: None
                    height: self.texture_size[1]
        GridLayout:
            id: dica_buttons
            cols: 5
            size_hint_y: 0.1
            spacing: dp(10)
        BoxLayout:
            orientation: 'vertical'
            size_hint_y: 0.2
            spacing: dp(10)
            BoxLayout:
                orientation: 'horizontal'
                size_hint_y: None
                height: dp(55)
                spacing: dp(10)
                    
                ThemedTextInput:
                    id: answer_input
                    hint_text: 'Sua resposta...'
                    size_hint_x: 0.8
                    on_text_validate: root.check_answer(self.text)

                OkIconButton:
                    on_press: root.check_answer(answer_input.text)
                    
            BoxLayout:
                orientation: 'horizontal'
                size_hint_y: None
                height: dp(55)
                spacing: dp(10)
                Button:
                    text: 'Sair'
                    on_press: root.confirm_exit()
                    background_color: 0,0,0,0
                    color: app.colors['text_on_accent']
                    font_size: '22sp'
                    bold: True
                    canvas.before:
                        Color:
                            rgba: get_color_from_hex("#1E2A6B") if self.state == 'down' else app.colors['text_grey_light_theme']
                        RoundedRectangle:
                            pos: self.pos
                            size: self.size
                            radius: [dp(15)]
                Button:
                    text: 'Pular carta'
                    on_press: root.load_next_card(skipped=True)
                    background_color: 0,0,0,0
                    color: app.colors['text_on_accent']
                    font_size: '22sp'
                    bold: True
                    canvas.before:
                        Color:
                            rgba: get_color_from_hex("#1E2A6B") if self.state == 'down' else app.colors['text_grey_light_theme']
                        RoundedRectangle:
                            pos: self.pos
                            size: self.size
                            radius: [dp(15)]
                Button:
                    text: 'Ver resposta'
                    on_press: root.show_answer_popup()
                    background_color: 0,0,0,0
                    color: app.colors['text_on_accent']
                    font_size: '22sp'
                    bold: True
                    canvas.before:
                        Color:
                            rgba: get_color_from_hex("#1E2A6B") if self.state == 'down' else app.colors['text_grey_light_theme']
                        RoundedRectangle:
                            pos: self.pos
                            size: self.size
                            radius: [dp(15)]
""")

class OkIconButton(ButtonBehavior, FloatLayout):
    pass

class MenuScreen(Screen):
    pass

class InstructionsScreen(Screen):
    pass

class PopupButton(Button):
    pass

class PopupSeparator(Widget):
    pass

class RecapEntry(BoxLayout):
    recap_text = StringProperty('')
    status_color = ListProperty([0, 0, 0, 1])

class PlayerConfigScreen(Screen):
    def start_game_validation(self):
        app_instance = App.get_running_app()
        if not app_instance.jogador_nome.strip():
            self.show_popup("", "Por favor, digite seu nome para começar.")
        else:
            app_instance.root.current = 'game'

    def show_popup(self, title, message):
        app = App.get_running_app()
        main_layout = BoxLayout(orientation='vertical', padding=dp(10), spacing=dp(10))

        # Barra de Título Customizada, agora apenas com o ícone centralizado
        title_bar = BoxLayout(orientation='horizontal', size_hint_y=None, height=dp(2))
        
        icon = Image(source='alerta.png', size_hint=(None, None), size=(dp(30), dp(30)))
        
        # Adicionamos um espaçador, o ícone, e outro espaçador
        title_bar.add_widget(Widget()) # Espaçador esquerdo
        title_bar.add_widget(icon)
        title_bar.add_widget(Widget()) # Espaçador direito

        separator = PopupSeparator(size_hint_y=None, height=dp(1))
        message_label = Label(text=message, halign='center', valign='middle', color=app.colors['text_on_light'])
        btn_ok = PopupButton(text="OK", size_hint_y=None, height=dp(44))

        main_layout.add_widget(title_bar)
        main_layout.add_widget(separator)
        main_layout.add_widget(message_label)
        main_layout.add_widget(btn_ok)
        
        popup = Popup(
            title='',
            separator_height=0,
            content=main_layout,
            size_hint=(0.4, 0.3),
            background='',
            background_color=app.colors['background_card']
        )
        btn_ok.bind(on_press=popup.dismiss)
        popup.open()


class GameScreen(Screen):
    current_card_theme = StringProperty("Categoria: [b]N/A[/b]")
    current_dica_index = NumericProperty(-1)
    dicas_reveladas = ListProperty([])

    cartas_master = [
        {"categoria": "Pessoa", "resposta": "Ada Lovelace", "dicas": ["É considerada a primeira programadora da história.", "Trabalhou nas anotações sobre a Máquina Analítica de Charles Babbage.", "Filha do poeta Lord Byron.", "Suas anotações são cruciais para a história da computação.", "Um idioma de programação foi nomeado em sua homenagem."]},
        {"categoria": "Coisa", "resposta": "Internet", "dicas": ["É uma rede global de computadores.", "Permite a troca de informações em todo o mundo.", "Surgiu a partir de um projeto militar nos EUA (ARPANET).", "É fundamental para a comunicação moderna.", "Você está usando ela para ler isso."]},
        {"categoria": "Ano", "resposta": "1995", "dicas": ["Foi o ano de lançamento do Windows 95.", "O JavaScript foi criado neste ano.", "O eBay e a Amazon foram fundados neste ano.", "Marca um boom inicial da internet comercial.", "Lançamento da primeira versão do Java."]},
        {"categoria": "Lugar", "resposta": "Vale do Silício", "dicas": ["Região no sul da Baía de São Francisco, Califórnia.", "Abriga muitas das maiores empresas de tecnologia do mundo.", "É um centro de inovação e startups.", "Recebeu seu nome devido à grande quantidade de empresas de semicondutores.", "Empresas como Apple, Google e Facebook nasceram aqui."]},
        {"categoria": "Coisa", "resposta": "Inteligência Artificial", "dicas": ["Campo da ciência da computação que se dedica a criar máquinas que simulam o raciocínio humano.", "Inclui áreas como aprendizado de máquina e redes neurais.", "Alimentado por grandes volumes de dados (Big Data).", "Está presente em assistentes virtuais e recomendações de streaming.", "Pode ser considerada uma 'mente' artificial."]},
        {"categoria": "Pessoa", "resposta": "Bill Gates", "dicas": ["Cofundador de uma das maiores empresas de software do mundo.", "Conhecido por sua filantropia e esforços em saúde global.", "Esteve à frente da 'revolução do computador pessoal'.", "Fundou a Microsoft.", "Um dos homens mais ricos do mundo."]}
    ]
    cartas_disponiveis = ObjectProperty([])
    current_card = ObjectProperty(None)
    hint_buttons = ListProperty([])
    
    def __init__(self, **kwargs):
        super(GameScreen, self).__init__(**kwargs)
        app = App.get_running_app()
        app.bind(pontuacao=self.update_score_label)
        self.bind(dicas_reveladas=self.update_dicas_display)
        Clock.schedule_once(self._finish_init)

    def _finish_init(self, dt):
        dica_layout = self.ids.dica_buttons
        for i in range(5):
            btn = Button(
                text=str(i + 1),
                font_size='22sp',
                bold=True,
                on_press=lambda *args, index=i: self.reveal_dica(index),
                background_color=(0,0,0,0)
            )
            self.hint_buttons.append(btn)
            dica_layout.add_widget(btn)
        self.on_current_dica_index(self, self.current_dica_index)

    def on_current_dica_index(self, instance, value):
        app = App.get_running_app()
        for i, btn in enumerate(self.hint_buttons):
            btn.canvas.before.clear()
            if i <= value:
                btn.disabled = True
                btn.color = app.colors['text_grey_light_theme']
            else:
                btn.disabled = False
                btn.color = app.colors['accent_main']
    
    def update_dicas_display(self, *args):
        if not self.ids:
            return
        if not self.dicas_reveladas:
            self.ids.dica_label.text = 'Clique nos numeros para revelar as dicas!'
        else:
            texto_formatado = []
            for i, dica_texto in enumerate(self.dicas_reveladas):
                texto_formatado.append(f"[b]Dica {i+1}:[/b] {dica_texto}")
            self.ids.dica_label.text = "\n".join(texto_formatado)

    def update_score_label(self, instance, score):
        self.ids.score_label.text = f"Pontos: {score}"

    def on_enter(self, *args):
        app = App.get_running_app()
        self.ids.player_name_label.text = f"Jogador: {app.jogador_nome}"
        self.ids.score_label.text = f"Pontos: {app.pontuacao}"
        self.reset_game()

    def reset_game(self):
        self.cartas_disponiveis = list(self.cartas_master)
        random.shuffle(self.cartas_disponiveis)
        app = App.get_running_app()
        app.pontuacao = 0
        app.game_recap = []
        self.load_next_card()

    def load_next_card(self, *args, skipped=False):
        app = App.get_running_app()
        
        # Só adiciona "pulou" ao resumo se a ação veio do botão
        if skipped and self.current_card:
            app.game_recap.append({
                "pergunta": self.current_card["resposta"],
                "resposta_dada": "Pulou",
                "resposta_correta": self.current_card["resposta"],
                "dicas": self.current_card["dicas"],
                "status": "pulou"
            })

        if self.cartas_disponiveis:
            self.current_card = self.cartas_disponiveis.pop(0)
            self.current_card_theme = f'Categoria: [b]{self.current_card["categoria"]}[/b]'
            self.ids.answer_input.text = ""
            self.current_dica_index = -1
            self.dicas_reveladas = []
        else:
            app.root.current = 'recap'

    def reveal_dica(self, index):
        if self.current_card and index == self.current_dica_index + 1:
            nova_dica = self.current_card["dicas"][index]
            self.dicas_reveladas = self.dicas_reveladas + [nova_dica]
            self.current_dica_index = index
        else:
            app = App.get_running_app()
            if 'dica_label' in self.ids:
                anim = Animation(color=app.colors['error'], duration=0.1) + Animation(color=app.colors['text_on_light'], duration=0.5)
                anim.start(self.ids.dica_label)
    
    def check_answer(self, answer):
        if not answer.strip():
            return
        app = App.get_running_app()
        if not self.current_card: return
        
        pontos_por_dica = [5, 4, 3, 2, 1]
        resposta_correta = self.current_card["resposta"]
        
        recap_entry = {
            "pergunta": resposta_correta,
            "resposta_dada": answer.strip(),
            "resposta_correta": resposta_correta,
            "dicas": self.current_card["dicas"]
        }

        if answer.strip().lower() == resposta_correta.lower():
            pontos_ganhos = 5 if self.current_dica_index == -1 else pontos_por_dica[self.current_dica_index]
            app.pontuacao += pontos_ganhos
            message = f"[color={app.colors_hex['success']}][b]Sua resposta está correta!\n(+{pontos_ganhos} pontos)[/b][/color]"
            self.ids.answer_input.text = ""
            
            recap_entry["status"] = "correto"
            app.game_recap.append(recap_entry) # Adiciona ao histórico
            
            self.show_feedback_popup("", message, "correct")
        else:
            message = f"[color={app.colors_hex['error']}][b]Sua resposta está errada![/b][/color]"
            
            recap_entry["status"] = "errado"
            app.game_recap.append(recap_entry) # Adiciona ao histórico

            self.show_feedback_popup("", message, "incorrect")
            anim = Animation(background_color=app.colors['error'], duration=0.1) + Animation(background_color=get_color_from_hex("#FFFFFF"), duration=0.5)
            anim.start(self.ids.answer_input)
    
    def show_feedback_popup(self, title, message, status):
        app = App.get_running_app()
        main_layout = BoxLayout(orientation='vertical', padding=dp(10), spacing=dp(10))
        icon_source = ''
        
        if status == 'correct':
            icon_source = 'trofeu.png'
        elif status == 'incorrect':
            icon_source = 'erro.png'

        if icon_source:
            # Barra de Título Customizada, agora apenas com o ícone centralizado
            title_bar = BoxLayout(orientation='horizontal', size_hint_y=None, height=dp(2))
            
            icon = Image(source=icon_source, size_hint=(None, None), size=(dp(30), dp(30)))

            # Adicionamos um espaçador, o ícone, e outro espaçador
            title_bar.add_widget(Widget()) # Espaçador esquerdo
            title_bar.add_widget(icon)
            title_bar.add_widget(Widget()) # Espaçador direito

            separator = PopupSeparator(size_hint_y=None, height=dp(1))
            message_label = Label(text=message, markup=True, font_size='24sp', halign='center')

            main_layout.add_widget(title_bar)
            main_layout.add_widget(separator)
            main_layout.add_widget(message_label)
            
            popup = Popup(
                title='',
                separator_height=0,
                content=main_layout,
                size_hint=(0.4, 0.3),
                background='',
                background_color=app.colors['background_card']
            )
        else:
            # Popups sem ícone (como o de fim de jogo) continuam como antes
            content = Label(text=message, markup=True, font_size='24sp', halign='center')
            popup = Popup(title=title, content=content,
                            size_hint=(0.7, 0.4),
                            background='',
                            background_color=app.colors['background_card'],
                            separator_color=app.colors['text_on_light'],
                            title_color=app.colors['text_on_light'])

        popup.auto_dismiss = False
        
        def dismiss_popup(dt):
            popup.dismiss()
            if status == "correct":
                self.load_next_card()
            elif status == "end_game":
                app.root.current = 'menu'

        popup.open()
        if status != "end_game":
            Clock.schedule_once(dismiss_popup, 2)

    def confirm_exit(self):
        app = App.get_running_app()
        content = BoxLayout(orientation='vertical', padding='10dp', spacing='10dp')
        
        message = Label(
            text='Tem certeza que deseja sair?\nTodo o seu progresso será perdido.',
            halign='center',
            valign='middle',
            color=app.colors['text_on_light'] # Fonte da mensagem preta
        )
        content.add_widget(message)

        buttons_layout = BoxLayout(orientation='horizontal', spacing='10dp', size_hint_y=None, height=dp(44))
        
        btn_yes = PopupButton(text='Sim, vou sair')
        btn_no = PopupButton(text='Não, vou ficar')

        buttons_layout.add_widget(btn_yes)
        buttons_layout.add_widget(btn_no)
        content.add_widget(buttons_layout)

        popup = Popup(
            title="Sair do Jogo",
            content=content,
            size_hint=(0.8, 0.4),
            auto_dismiss=False,
            # --- AQUI ESTÃO AS MUDANÇAS DE ESTILO ---
            background='', # Remove a imagem de fundo padrão
            background_color=app.colors['background_card'], # Fundo branco
            separator_color=app.colors['text_on_light'], # Linha preta
            title_color=app.colors['text_on_light'] # Título preto
        )

        def exit_to_menu(instance):
            popup.dismiss()
            app.root.current = 'menu'
        
        btn_yes.bind(on_press=exit_to_menu)
        btn_no.bind(on_press=popup.dismiss)
        popup.open()

    def show_answer_popup(self):
        """
        Cria e exibe um popup para mostrar a resposta correta da carta atual.
        """
        if not self.current_card:
            return  # Não faz nada se não houver uma carta carregada

        app = App.get_running_app()
        resposta_correta = self.current_card['resposta']

        # Layout principal do conteúdo do popup
        content_layout = BoxLayout(orientation='vertical', padding=dp(10), spacing=dp(10))

        # Mensagem com a resposta
        message_label = Label(
            text=f"A resposta correta era:\n\n[b]{resposta_correta}[/b]",
            markup=True,
            font_size='20sp',
            halign='center',
            valign='middle',
            color=app.colors['text_on_light']
        )
        content_layout.add_widget(message_label)
        
        # Botão para fechar o popup e ir para a próxima carta
        next_card_button = PopupButton(
            text='Próxima Carta',
            size_hint_y=None,
            height=dp(44)
        )
        content_layout.add_widget(next_card_button)

        # Criação do Popup
        popup = Popup(
            title="Resposta",
            content=content_layout,
            size_hint=(0.8, 0.4),
            auto_dismiss=False,
            background='',  # Remove o fundo padrão
            background_color=app.colors['background_card'],  # Define um fundo branco
            separator_color=app.colors['text_on_light'],  # Cor do separador do título
            title_color=app.colors['text_on_light']  # Cor do texto do título
        )

        # Ação do botão: fecha o popup e carrega a próxima carta
        def go_to_next_card(instance):
            popup.dismiss()
            self.load_next_card()

        next_card_button.bind(on_press=go_to_next_card)
        popup.open()

class CodexApp(App):
    colors = {
        "background_main_light": get_color_from_hex("#F5F5F5"),
        "background_card": get_color_from_hex("#FFFFFF"),
        "accent_main": get_color_from_hex("#2c3c8d"),
        "accent_secondary": get_color_from_hex("#E76F51"),
        "text_on_light": get_color_from_hex("#000000"),
        "text_on_accent": get_color_from_hex("#FFFFFF"),
        "text_grey_light_theme": get_color_from_hex("#8D99AE"),
        "background_main_dark": get_color_from_hex("#1E293B"),
        "text_on_dark": get_color_from_hex("#FFFFFF"),
        "success": get_color_from_hex("#2A9D8F"),
        "error": get_color_from_hex("#E63946"),
        "popup_blue": get_color_from_hex("#E3F2FD"),
    }
    
    colors_hex = {
        "success": "#2A9D8F",
        "error": "#E63946",
        "text_on_accent": "#FFFFFF"
    }
    
    jogador_nome = StringProperty("")
    pontuacao = NumericProperty(0)
    game_recap = ListProperty([])

    def build(self):
        sm = ScreenManager()
        sm.add_widget(MenuScreen(name='menu'))
        sm.add_widget(InstructionsScreen(name='instructions'))
        sm.add_widget(PlayerConfigScreen(name='player_config'))
        sm.add_widget(GameScreen(name='game'))
        sm.add_widget(RecapScreen(name='recap'))
        return sm

class RecapScreen(Screen):
    def on_enter(self):
        """
        Chamado quando a tela é exibida. Constrói a lista de resultados.
        (VERSÃO GABARITO DETALHADO)
        """
        app = App.get_running_app()
        recap_list_widget = self.ids.recap_list
        recap_list_widget.clear_widgets()
        self.ids.final_score_label.text = f"Pontuação Final: [b]{app.pontuacao}[/b]"

        if not app.game_recap:
            recap_list_widget.add_widget(Label(text="Nenhum histórico de jogo para mostrar."))
            return

        for entry in app.game_recap:
            status = entry.get("status", "N/A")
            resposta_dada = entry.get("resposta_dada", "N/A")
            resposta_correta = entry.get("resposta_correta", "N/A")
            dicas = entry.get("dicas", [])

            # Formata a lista de dicas
            dicas_formatadas = ""
            for i, dica_texto in enumerate(dicas):
                dicas_formatadas += f"    • Dica {i+1}: {dica_texto}\n"

            # Monta o texto final para o gabarito
            texto_recap = (
                f"[b]Gabarito: {resposta_correta}[/b]\n\n"
                f"Sua resposta: {resposta_dada}\n\n"
                f"Dicas da carta:\n{dicas_formatadas}"
            )
            
            # Define a cor da barra lateral
            if status == 'correto':
                cor_status = app.colors['success']
            elif status == 'errado':
                cor_status = app.colors['error']
            else: # Pulos e outros
                cor_status = app.colors['text_grey_light_theme']

            # Cria a entrada do resumo
            recap_item = RecapEntry(recap_text=texto_recap, status_color=cor_status)
            recap_list_widget.add_widget(recap_item)

if __name__ == '__main__':
    CodexApp().run()