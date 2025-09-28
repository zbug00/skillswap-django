from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import authenticate
from .models import *

class ProposalForm(forms.ModelForm):
    class Meta:
        model = Proposal
        fields = ['skill_offered', 'skill_wanted', 'description', 'format', 'deadlines']
        widgets = {
            'description': forms.Textarea(attrs={'rows': 4, 'placeholder': 'Опишите детали обмена...'}),
            'deadlines': forms.TextInput(attrs={'placeholder': 'Например: до 10 июня'}),
        }
        labels = {
            'skill_offered': 'Навык, который вы предлагаете',
            'skill_wanted': 'Навык, который хотите получить',
            'format': 'Формат занятий',
            'deadlines': 'Сроки (необязательно)',
            'description': 'Дополнительное описание',
        }

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)
        if user:
            self.fields['skill_offered'].queryset = Skill.objects.filter(
                id__in=user.user_skills.values_list('skill_id', flat=True)
            )
            self.fields['skill_wanted'].queryset = Skill.objects.all()

class SkillForm(forms.ModelForm):
    class Meta:
        model = Skill
        fields = ['name', 'description', 'level', 'category']
        widgets = {
            'description': forms.Textarea(attrs={'rows': 3, 'placeholder': 'Опишите навык...'}),
            'name': forms.TextInput(attrs={'placeholder': 'Например: Игра на гитаре'}),
        }
        labels = {
            'name': 'Название навыка',
            'description': 'Описание',
            'level': 'Уровень владения',
            'category': 'Категория',
        }
class RegisterForm(UserCreationForm):
    full_name = forms.CharField(max_length=255, required=True, label="Полное имя")
    email = forms.EmailField(required=True, label="Email")

    class Meta:
        model = User
        fields = ("email", "full_name", "password1", "password2")

class LoginForm(AuthenticationForm):
    username = forms.EmailField(widget=forms.EmailInput(attrs={'placeholder': 'your@example.com'}), label="Email")

    def clean(self):
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')

        if username and password:
            # Используем email как username для аутентификации
            user = authenticate(self.request, username=username, password=password)
            if user is None:
                raise forms.ValidationError("Неверный email или пароль.")
            elif not user.is_active:
                raise forms.ValidationError("Аккаунт неактивен.")
            return self.cleaned_data
        return super().clean()